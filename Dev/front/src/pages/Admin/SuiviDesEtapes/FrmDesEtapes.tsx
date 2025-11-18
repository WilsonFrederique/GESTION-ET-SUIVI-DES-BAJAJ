import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './FrmDesEtapes.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoCalendarOutline,
  IoPersonOutline,
  IoCashOutline,
  IoDocumentTextOutline,
  IoAddCircleOutline,
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoStatsChartOutline,
  IoCreateOutline
} from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

// Définir StyledBreadcrumb
const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
}) as typeof Chip;

// Interfaces TypeScript
interface Projet {
  id: number;
  nom: string;
}

interface Responsable {
  id: number;
  nom: string;
  prenom: string;
}

interface EtapeFormData {
  nom_etape: string;
  description: string;
  ordre: number;
  date_debut_prevue: string;
  date_fin_prevue: string;
  date_debut_reelle: string;
  date_fin_reelle: string;
  est_terminee: boolean;
  pourcentage_termine: number;
  cout_prevue: number;
  cout_reel: number;
  id_utilisateur_responsable: number;
  id_projet: number;
}

interface FormErrors {
  nom_etape?: string;
  description?: string;
  ordre?: string;
  date_debut_prevue?: string;
  date_fin_prevue?: string;
  pourcentage_termine?: string;
  cout_prevue?: string;
  cout_reel?: string;
  id_utilisateur_responsable?: string;
  id_projet?: string;
}

// Interface pour les données d'étape provenant de SuiviDesEtapes
interface EtapeData {
  id_etape: number;
  nom_etape: string;
  description: string;
  ordre: number;
  date_debut_prevue: string;
  date_fin_prevue: string;
  date_debut_reelle: string | null;
  date_fin_reelle: string | null;
  est_terminee: boolean;
  pourcentage_termine: number;
  cout_prevue: number;
  cout_reel: number | null;
  id_utilisateur_responsable: number;
  responsable_nom?: string;
  responsable_prenom?: string;
  statut: 'en_retard' | 'en_cours' | 'a_venir' | 'termine';
  jours_retard: number;
}

const FrmDesEtapes: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // États avec types explicites
  const [formData, setFormData] = useState<EtapeFormData>({
    nom_etape: '',
    description: '',
    ordre: 1,
    date_debut_prevue: '',
    date_fin_prevue: '',
    date_debut_reelle: '',
    date_fin_reelle: '',
    est_terminee: false,
    pourcentage_termine: 0,
    cout_prevue: 0,
    cout_reel: 0,
    id_utilisateur_responsable: 0,
    id_projet: 0
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Données mock avec types
  const projets: Projet[] = [
    { id: 1, nom: 'Projet Alpha' },
    { id: 2, nom: 'Projet Beta' },
    { id: 3, nom: 'Projet Gamma' },
    { id: 4, nom: 'Projet Delta' },
    { id: 5, nom: 'Projet Epsilon' }
  ];

  const responsables: Responsable[] = [
    { id: 1, nom: 'Dupont', prenom: 'Jean' },
    { id: 2, nom: 'Martin', prenom: 'Marie' },
    { id: 3, nom: 'Bernard', prenom: 'Pierre' },
    { id: 4, nom: 'Dubois', prenom: 'Sophie' },
    { id: 5, nom: 'Moreau', prenom: 'Luc' }
  ];

  // Données mock pour les étapes existantes
  const mockEtapes: EtapeData[] = [
    {
      id_etape: 1,
      nom_etape: "Étude de faisabilité",
      description: "Analyse technique et économique du projet",
      ordre: 1,
      date_debut_prevue: "2024-01-15",
      date_fin_prevue: "2024-02-15",
      date_debut_reelle: "2024-01-15",
      date_fin_reelle: "2024-02-20",
      est_terminee: true,
      pourcentage_termine: 100,
      cout_prevue: 15000,
      cout_reel: 16500,
      id_utilisateur_responsable: 1,
      responsable_nom: "Dupont",
      responsable_prenom: "Jean",
      statut: 'termine',
      jours_retard: 5
    },
    {
      id_etape: 2,
      nom_etape: "Conception détaillée",
      description: "Développement des spécifications techniques",
      ordre: 2,
      date_debut_prevue: "2024-02-16",
      date_fin_prevue: "2024-04-15",
      date_debut_reelle: "2024-02-20",
      date_fin_reelle: null,
      est_terminee: false,
      pourcentage_termine: 75,
      cout_prevue: 35000,
      cout_reel: 28000,
      id_utilisateur_responsable: 2,
      responsable_nom: "Martin",
      responsable_prenom: "Marie",
      statut: 'en_retard',
      jours_retard: 10
    },
    {
      id_etape: 3,
      nom_etape: "Développement",
      description: "Implémentation des fonctionnalités principales",
      ordre: 3,
      date_debut_prevue: "2024-04-16",
      date_fin_prevue: "2024-07-15",
      date_debut_reelle: null,
      date_fin_reelle: null,
      est_terminee: false,
      pourcentage_termine: 0,
      cout_prevue: 80000,
      cout_reel: null,
      id_utilisateur_responsable: 3,
      responsable_nom: "Bernard",
      responsable_prenom: "Pierre",
      statut: 'a_venir',
      jours_retard: 0
    }
  ];

  // Effet pour déterminer le mode (création ou modification) et charger les données
  useEffect(() => {
    const initializeForm = async () => {
      setLoading(true);
      
      // Vérifier si on est en mode modification
      if (id && id !== 'nouveau') {
        setIsEditMode(true);
        
        // Chercher l'étape dans les données mock
        const etapeExistante = mockEtapes.find(etape => etape.id_etape === parseInt(id));
        
        if (etapeExistante) {
          // Pré-remplir le formulaire avec les données de l'étape
          setFormData({
            nom_etape: etapeExistante.nom_etape,
            description: etapeExistante.description,
            ordre: etapeExistante.ordre,
            date_debut_prevue: etapeExistante.date_debut_prevue,
            date_fin_prevue: etapeExistante.date_fin_prevue,
            date_debut_reelle: etapeExistante.date_debut_reelle || '',
            date_fin_reelle: etapeExistante.date_fin_reelle || '',
            est_terminee: etapeExistante.est_terminee,
            pourcentage_termine: etapeExistante.pourcentage_termine,
            cout_prevue: etapeExistante.cout_prevue,
            cout_reel: etapeExistante.cout_reel || 0,
            id_utilisateur_responsable: etapeExistante.id_utilisateur_responsable,
            id_projet: 1 // Par défaut, à adapter selon vos besoins
          });
        } else {
          // Si l'étape n'est pas trouvée, rediriger vers la liste
          navigate('/suivi-etapes');
          return;
        }
      } else {
        setIsEditMode(false);
      }
      
      setLoading(false);
    };

    initializeForm();
  }, [id, navigate]);

  // Gestion des changements avec types
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    
    let newValue: string | number | boolean = value;

    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (
      name === 'ordre' || 
      name === 'pourcentage_termine' || 
      name === 'cout_prevue' || 
      name === 'cout_reel' || 
      name === 'id_utilisateur_responsable' || 
      name === 'id_projet'
    ) {
      newValue = value === '' ? 0 : Number(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Effacer l'erreur quand l'utilisateur commence à taper
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validation du formulaire avec types
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation du nom de l'étape
    if (!formData.nom_etape.trim()) {
      newErrors.nom_etape = 'Le nom de l\'étape est requis';
    } else if (formData.nom_etape.length > 255) {
      newErrors.nom_etape = 'Le nom de l\'étape ne peut pas dépasser 255 caractères';
    }

    // Validation de la description
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    // Validation de l'ordre
    if (formData.ordre <= 0) {
      newErrors.ordre = 'L\'ordre doit être supérieur à 0';
    }

    // Validation des dates
    if (!formData.date_debut_prevue) {
      newErrors.date_debut_prevue = 'La date de début prévue est requise';
    }

    if (!formData.date_fin_prevue) {
      newErrors.date_fin_prevue = 'La date de fin prévue est requise';
    }

    if (formData.date_debut_prevue && formData.date_fin_prevue) {
      const debut = new Date(formData.date_debut_prevue);
      const fin = new Date(formData.date_fin_prevue);
      
      if (debut >= fin) {
        newErrors.date_fin_prevue = 'La date de fin doit être après la date de début';
      }
    }

    // Validation du pourcentage
    if (formData.pourcentage_termine < 0 || formData.pourcentage_termine > 100) {
      newErrors.pourcentage_termine = 'Le pourcentage doit être entre 0 et 100';
    }

    // Validation des coûts
    if (formData.cout_prevue < 0) {
      newErrors.cout_prevue = 'Le coût prévu ne peut pas être négatif';
    }

    if (formData.cout_reel < 0) {
      newErrors.cout_reel = 'Le coût réel ne peut pas être négatif';
    }

    // Validation des sélecteurs
    if (!formData.id_utilisateur_responsable) {
      newErrors.id_utilisateur_responsable = 'Un responsable doit être sélectionné';
    }

    if (!formData.id_projet) {
      newErrors.id_projet = 'Un projet doit être sélectionné';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi des données
      console.log('Données soumises:', formData);
      console.log('Mode:', isEditMode ? 'Modification' : 'Création');
      
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      
      // Message de succès
      const message = isEditMode 
        ? `Étape "${formData.nom_etape}" modifiée avec succès`
        : `Étape "${formData.nom_etape}" créée avec succès`;
      
      console.log(message);
      
      // Redirection après succès
      navigate('/suivi-etapes');
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    navigate('/suivi-etapes');
  };

  // Effet pour la logique automatique du pourcentage
  useEffect(() => {
    if (formData.est_terminee && formData.pourcentage_termine !== 100) {
      setFormData(prev => ({ ...prev, pourcentage_termine: 100 }));
    }
  }, [formData.est_terminee, formData.pourcentage_termine]);

  // Fonction utilitaire pour formater la date du jour
  const getTodayDate = (): string => {
    return new Date().toISOString().split('T')[0];
  };

  // Récupérer le nom de l'étape pour l'affichage
  const getPageTitle = () => {
    if (isEditMode) {
      return `Modifier l'étape - ${formData.nom_etape || 'Chargement...'}`;
    }
    return 'Créer une nouvelle étape';
  };

  const getPageSubtitle = () => {
    if (isEditMode) {
      return 'Modifier les informations de cette étape de projet';
    }
    return 'Planifier et configurer une étape de projet';
  };

  const getBreadcrumbLabel = () => {
    if (isEditMode) {
      return 'Modifier Étape';
    }
    return 'Nouvelle Étape';
  };

  const getSubmitButtonText = () => {
    if (isSubmitting) {
      return isEditMode ? 'Modification en cours...' : 'Création en cours...';
    }
    return isEditMode ? 'Modifier l\'étape' : 'Créer l\'étape';
  };

  const getSubmitButtonIcon = () => {
    return isEditMode ? <IoCreateOutline /> : <IoAddCircleOutline />;
  };

  if (loading) {
    return (
      <div className="frm-etapes-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement {isEditMode ? 'des données de l\'étape' : 'du formulaire'}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="frm-etapes-container">
      <div className="right-content w-100">
        {/* En-tête */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <button 
              type="button"
              className="btn-back" 
              onClick={handleCancel}
              aria-label="Retour au suivi des étapes"
            >
              <IoArrowBackOutline />
            </button>
            <div>
              <h5 className="mb-0">{getPageTitle()}</h5>
              <p className="mb-0 subtitle">{getPageSubtitle()}</p>
            </div>
          </div>
          <div className="header-controls">
            <Breadcrumbs aria-label="breadcrumb" className="ms-auto breadcrumb_">
              <a href="/">
                <StyledBreadcrumb
                  className="StyledBreadcrumb"
                  component="a"
                  label="Accueil"
                  icon={<HomeIcon fontSize="small" />}
                />
              </a>
              <a href="/suiviDesEtapes">
                <StyledBreadcrumb
                  className="StyledBreadcrumb"
                  label="Suivi des Étapes"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </a>
              <StyledBreadcrumb
                className="StyledBreadcrumb"
                label={getBreadcrumbLabel()}
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Formulaire Principal */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="etape-form" noValidate>
            <div className="form-grid">
              {/* Section: Informations de base */}
              <div className="form-section">
                <div className="section-header">
                  <IoDocumentTextOutline className="section-icon" />
                  <h4>Informations de base</h4>
                </div>
                
                <div className="form-group">
                  <label htmlFor="nom_etape" className="form-label">
                    Nom de l'étape <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="nom_etape"
                    name="nom_etape"
                    value={formData.nom_etape}
                    onChange={handleChange}
                    className={`form-input ${errors.nom_etape ? 'error' : ''}`}
                    placeholder="Ex: Conception détaillée, Développement, Tests..."
                    maxLength={255}
                    required
                  />
                  {errors.nom_etape && (
                    <span className="error-message" role="alert">{errors.nom_etape}</span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Décrivez en détail les objectifs et livrables de cette étape..."
                    required
                  />
                  {errors.description && (
                    <span className="error-message" role="alert">{errors.description}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="ordre" className="form-label">
                      Ordre dans le projet <span className="required">*</span>
                    </label>
                    <input
                      type="number"
                      id="ordre"
                      name="ordre"
                      value={formData.ordre}
                      onChange={handleChange}
                      min="1"
                      className={`form-input ${errors.ordre ? 'error' : ''}`}
                      required
                    />
                    {errors.ordre && (
                      <span className="error-message" role="alert">{errors.ordre}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="id_projet" className="form-label">
                      Projet <span className="required">*</span>
                    </label>
                    <select
                      id="id_projet"
                      name="id_projet"
                      value={formData.id_projet}
                      onChange={handleChange}
                      className={`form-select ${errors.id_projet ? 'error' : ''}`}
                      required
                    >
                      <option value={0}>Sélectionnez un projet</option>
                      {projets.map((projet: Projet) => (
                        <option key={projet.id} value={projet.id}>
                          {projet.nom}
                        </option>
                      ))}
                    </select>
                    {errors.id_projet && (
                      <span className="error-message" role="alert">{errors.id_projet}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Section: Planning */}
              <div className="form-section">
                <div className="section-header">
                  <IoCalendarOutline className="section-icon" />
                  <h4>Planning</h4>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date_debut_prevue" className="form-label">
                      Date de début prévue <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="date_debut_prevue"
                      name="date_debut_prevue"
                      value={formData.date_debut_prevue}
                      onChange={handleChange}
                      className={`form-input ${errors.date_debut_prevue ? 'error' : ''}`}
                      min={getTodayDate()}
                      required
                    />
                    {errors.date_debut_prevue && (
                      <span className="error-message" role="alert">{errors.date_debut_prevue}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="date_fin_prevue" className="form-label">
                      Date de fin prévue <span className="required">*</span>
                    </label>
                    <input
                      type="date"
                      id="date_fin_prevue"
                      name="date_fin_prevue"
                      value={formData.date_fin_prevue}
                      onChange={handleChange}
                      className={`form-input ${errors.date_fin_prevue ? 'error' : ''}`}
                      min={formData.date_debut_prevue || getTodayDate()}
                      required
                    />
                    {errors.date_fin_prevue && (
                      <span className="error-message" role="alert">{errors.date_fin_prevue}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date_debut_reelle" className="form-label">
                      Date de début réelle
                    </label>
                    <input
                      type="date"
                      id="date_debut_reelle"
                      name="date_debut_reelle"
                      value={formData.date_debut_reelle}
                      onChange={handleChange}
                      className="form-input"
                      max={getTodayDate()}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="date_fin_reelle" className="form-label">
                      Date de fin réelle
                    </label>
                    <input
                      type="date"
                      id="date_fin_reelle"
                      name="date_fin_reelle"
                      value={formData.date_fin_reelle}
                      onChange={handleChange}
                      className="form-input"
                      max={getTodayDate()}
                    />
                  </div>
                </div>
              </div>

              {/* Section: Budget et Progression */}
              <div className="form-section">
                <div className="section-header">
                  <IoCashOutline className="section-icon" />
                  <h4>Budget et Progression</h4>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cout_prevue" className="form-label">
                      Coût prévu (€) <span className="required">*</span>
                    </label>
                    <div className="input-with-icon">
                      <IoCashOutline className="input-icon" />
                      <input
                        type="number"
                        id="cout_prevue"
                        name="cout_prevue"
                        value={formData.cout_prevue || ''}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`form-input ${errors.cout_prevue ? 'error' : ''}`}
                        placeholder="0.00"
                        required
                      />
                    </div>
                    {errors.cout_prevue && (
                      <span className="error-message" role="alert">{errors.cout_prevue}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="cout_reel" className="form-label">
                      Coût réel (€)
                    </label>
                    <div className="input-with-icon">
                      <IoCashOutline className="input-icon" />
                      <input
                        type="number"
                        id="cout_reel"
                        name="cout_reel"
                        value={formData.cout_reel || ''}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className={`form-input ${errors.cout_reel ? 'error' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.cout_reel && (
                      <span className="error-message" role="alert">{errors.cout_reel}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="pourcentage_termine" className="form-label">
                    Pourcentage terminé (%)
                  </label>
                  <div className="input-with-icon">
                    <IoStatsChartOutline className="input-icon" />
                    <input
                      type="number"
                      id="pourcentage_termine"
                      name="pourcentage_termine"
                      value={formData.pourcentage_termine}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className={`form-input ${errors.pourcentage_termine ? 'error' : ''}`}
                      disabled={formData.est_terminee}
                    />
                  </div>
                  {errors.pourcentage_termine && (
                    <span className="error-message" role="alert">{errors.pourcentage_termine}</span>
                  )}
                </div>

                <div className="form-group checkbox-group">
                  <label htmlFor="est_terminee" className="checkbox-label">
                    <input
                      type="checkbox"
                      id="est_terminee"
                      name="est_terminee"
                      checked={formData.est_terminee}
                      onChange={handleChange}
                      className="checkbox-input"
                    />
                    <span className="checkbox-custom"></span>
                    Étape terminée
                  </label>
                  {formData.est_terminee && (
                    <div className="completion-badge">
                      <IoCheckmarkCircleOutline />
                      <span>100% complété automatiquement</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Section: Responsable */}
              <div className="form-section">
                <div className="section-header">
                  <IoPersonOutline className="section-icon" />
                  <h4>Responsable</h4>
                </div>

                <div className="form-group">
                  <label htmlFor="id_utilisateur_responsable" className="form-label">
                    Responsable de l'étape <span className="required">*</span>
                  </label>
                  <select
                    id="id_utilisateur_responsable"
                    name="id_utilisateur_responsable"
                    value={formData.id_utilisateur_responsable}
                    onChange={handleChange}
                    className={`form-select ${errors.id_utilisateur_responsable ? 'error' : ''}`}
                    required
                  >
                    <option value={0}>Sélectionnez un responsable</option>
                    {responsables.map((responsable: Responsable) => (
                      <option key={responsable.id} value={responsable.id}>
                        {responsable.prenom} {responsable.nom}
                      </option>
                    ))}
                  </select>
                  {errors.id_utilisateur_responsable && (
                    <span className="error-message" role="alert">{errors.id_utilisateur_responsable}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions du formulaire */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    {getSubmitButtonText()}
                  </>
                ) : (
                  <>
                    {getSubmitButtonIcon()}
                    {getSubmitButtonText()}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default FrmDesEtapes;