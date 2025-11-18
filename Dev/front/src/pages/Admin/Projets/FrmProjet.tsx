import React, { useState, useEffect } from 'react';
import './FrmProjet.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoArrowBackOutline,
  IoSaveOutline,
  IoCloseOutline,
  IoDocumentTextOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoPeopleOutline,
  IoMapOutline,
  IoTimeOutline
} from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

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
  id_projet?: number;
  reference: string;
  nom: string;
  description: string;
  type_projet: 'infrastructure' | 'social' | 'formation' | 'urgence';
  localisation: string;
  latitude: number | null;
  longitude: number | null;
  budget_prevue: number;
  budget_depense: number;
  date_debut_prevue: string;
  date_fin_prevue: string;
  date_debut_reelle: string;
  date_fin_reelle: string;
  date_creation: string;
  etat: 'planifie' | 'en_cours' | 'suspendu' | 'termine' | 'annule';
  pourcentage_avancement: number;
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  id_utilisateur_createur: number;
  id_utilisateur_responsable: number;
  responsable?: string;
  region?: string;
  est_en_retard?: boolean;
}

interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  email: string;
}

const FrmProjet: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditMode = location.pathname.includes('modifier');
  const projetExist = location.state?.projet;

  // États du formulaire
  const [formData, setFormData] = useState<Projet>({
    reference: '',
    nom: '',
    description: '',
    type_projet: 'infrastructure',
    localisation: '',
    latitude: null,
    longitude: null,
    budget_prevue: 0,
    budget_depense: 0,
    date_debut_prevue: '',
    date_fin_prevue: '',
    date_debut_reelle: '',
    date_fin_reelle: '',
    date_creation: new Date().toISOString().split('T')[0],
    etat: 'planifie',
    pourcentage_avancement: 0,
    priorite: 'moyenne',
    id_utilisateur_createur: 1,
    id_utilisateur_responsable: 1
  });

  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [, setShowMap] = useState<boolean>(false);
  const [showRealDates, setShowRealDates] = useState<boolean>(false);

  // Données mock pour les utilisateurs
  useEffect(() => {
    const mockUtilisateurs: Utilisateur[] = [
      { id_utilisateur: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@email.com' },
      { id_utilisateur: 2, nom: 'Martin', prenom: 'Marie', email: 'marie.martin@email.com' },
      { id_utilisateur: 3, nom: 'Durand', prenom: 'Pierre', email: 'pierre.durand@email.com' },
      { id_utilisateur: 4, nom: 'Leroy', prenom: 'Sophie', email: 'sophie.leroy@email.com' },
      { id_utilisateur: 5, nom: 'Moreau', prenom: 'Thomas', email: 'thomas.moreau@email.com' }
    ];

    setUtilisateurs(mockUtilisateurs);

    // Si en mode édition, charger les données du projet
    if (isEditMode && projetExist) {
      // Adapter les données du projet reçu au format attendu par le formulaire
      const adaptedProjet: Projet = {
        ...projetExist,
        // S'assurer que les champs optionnels sont présents
        latitude: projetExist.latitude || null,
        longitude: projetExist.longitude || null,
        date_debut_reelle: projetExist.date_debut_reelle || '',
        date_fin_reelle: projetExist.date_fin_reelle || '',
        id_utilisateur_createur: projetExist.id_utilisateur_createur || 1,
        id_utilisateur_responsable: projetExist.id_utilisateur_responsable || 1
      };
      
      setFormData(adaptedProjet);
      
      // Afficher les dates réelles si elles existent
      if (projetExist.date_debut_reelle || projetExist.date_fin_reelle) {
        setShowRealDates(true);
      }
      
      console.log('Projet chargé pour modification:', adaptedProjet);
    } else {
      // Générer une référence automatique pour les nouveaux projets
      generateReference();
    }
  }, [isEditMode, projetExist]);

  // Génération automatique de référence
  const generateReference = () => {
    const timestamp = new Date().getTime();
    const ref = `PROJ-${new Date().getFullYear()}-${timestamp.toString().slice(-4)}`;
    setFormData(prev => ({ ...prev, reference: ref }));
  };

  // Gestion des changements de formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));

    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Gestion des dates
  const handleDateChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestion du changement d'état
  const handleEtatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEtat = e.target.value as Projet['etat'];
    
    setFormData(prev => ({
      ...prev,
      etat: newEtat
    }));

    // Si l'état passe à "en_cours" et que la date de début réelle n'est pas définie, la définir à aujourd'hui
    if (newEtat === 'en_cours' && !formData.date_debut_reelle) {
      setFormData(prev => ({
        ...prev,
        date_debut_reelle: new Date().toISOString().split('T')[0]
      }));
      setShowRealDates(true);
    }

    // Si l'état passe à "termine" et que la date de fin réelle n'est pas définie, la définir à aujourd'hui
    if (newEtat === 'termine' && !formData.date_fin_reelle) {
      setFormData(prev => ({
        ...prev,
        date_fin_reelle: new Date().toISOString().split('T')[0]
      }));
      setShowRealDates(true);
    }
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom du projet est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description du projet est requise';
    }

    if (!formData.localisation.trim()) {
      newErrors.localisation = 'La localisation est requise';
    }

    if (formData.budget_prevue <= 0) {
      newErrors.budget_prevue = 'Le budget prévu doit être supérieur à 0';
    }

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
        newErrors.date_fin_prevue = 'La date de fin doit être postérieure à la date de début';
      }
    }

    // Validation des dates réelles si elles sont renseignées
    if (formData.date_debut_reelle && formData.date_fin_reelle) {
      const debutReel = new Date(formData.date_debut_reelle);
      const finReel = new Date(formData.date_fin_reelle);
      
      if (debutReel >= finReel) {
        newErrors.date_fin_reelle = 'La date de fin réelle doit être postérieure à la date de début réelle';
      }
    }

    if (!formData.id_utilisateur_responsable) {
      newErrors.id_utilisateur_responsable = 'Le responsable du projet est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Préparer les données pour l'envoi
      const dataToSubmit = {
        ...formData,
        // S'assurer que les dates réelles sont null si vides
        date_debut_reelle: formData.date_debut_reelle || null,
        date_fin_reelle: formData.date_fin_reelle || null,
        // La date de création est gérée automatiquement par la base de données
        date_creation: isEditMode ? formData.date_creation : new Date().toISOString()
      };

      // Simulation d'envoi des données
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Données du projet:', dataToSubmit);
      alert(isEditMode ? 'Projet modifié avec succès!' : 'Projet créé avec succès!');
      
      // Redirection vers la liste des projets
      navigate('/projetListes');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      alert('Une erreur est survenue lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  // Annulation
  const handleCancel = () => {
    if (window.confirm('Voulez-vous vraiment annuler ? Les modifications non sauvegardées seront perdues.')) {
      navigate('/projetListes');
    }
  };

  // Gestion de la géolocalisation
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }));
          setShowMap(true);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          alert('Impossible d\'obtenir la localisation actuelle');
        }
      );
    } else {
      alert('La géolocalisation n\'est pas supportée par votre navigateur');
    }
  };

  // Calcul automatique de l'avancement basé sur les dates
  const calculateAutoProgress = () => {
    if (!formData.date_debut_prevue || !formData.date_fin_prevue) return;

    const debut = new Date(formData.date_debut_prevue);
    const fin = new Date(formData.date_fin_prevue);
    const aujourdhui = new Date();

    if (aujourdhui < debut) {
      return 0; // Projet pas encore commencé
    } else if (aujourdhui > fin) {
      return 100; // Projet dépassé
    } else {
      const total = fin.getTime() - debut.getTime();
      const ecoule = aujourdhui.getTime() - debut.getTime();
      return Math.min(Math.round((ecoule / total) * 100), 100);
    }
  };

  // Appliquer le calcul automatique d'avancement
  const handleAutoProgress = () => {
    const progress = calculateAutoProgress();
    if (progress !== undefined) {
      setFormData(prev => ({
        ...prev,
        pourcentage_avancement: progress
      }));
    }
  };

  return (
    <div className="frm-projet-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <button 
              type="button"
              className="btn-back" 
              onClick={() => navigate('/projetListes')}
              aria-label="Retour à la liste des projets"
            >
              <IoArrowBackOutline />
            </button>
            <div>
              <h5 className="mb-0">
                {isEditMode ? 'Modifier le Projet' : 'Nouveau Projet'}
              </h5>
              <p className="mb-0 subtitle">
                {isEditMode ? `Modification du projet: ${formData.nom}` : 'Création d\'un nouveau projet'}
              </p>
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
              <a href="/projetListes">
                <StyledBreadcrumb
                  className="StyledBreadcrumb"
                  label="Projets"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </a>
              <StyledBreadcrumb
                className="StyledBreadcrumb"
                label={isEditMode ? "Modifier" : "Nouveau"}
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bgColor card shadow border-0 p-4 mt-4">
          <form onSubmit={handleSubmit} className="projet-form">
            {/* Section Informations Générales */}
            <div className="form-section">
              <div className="section-header">
                <IoDocumentTextOutline className="section-icon" />
                <h4>Informations Générales</h4>
              </div>

              <div className="form-grid mb-4">
                <div className="form-group">
                  <label htmlFor="reference" className="form-label">
                    Référence du Projet <span className="span-e">*</span>
                  </label>
                  <input
                    type="text"
                    id="reference"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className={`form-input ${errors.reference ? 'error' : ''}`}
                    placeholder="Référence automatique"
                    readOnly
                  />
                  {errors.reference && <span className="error-message">{errors.reference}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="nom" className="form-label">
                    Nom du Projet
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className={`form-input ${errors.nom ? 'error' : ''}`}
                    placeholder="Entrez le nom du projet"
                    required
                  />
                  {errors.nom && <span className="error-message">{errors.nom}</span>}
                </div>
              </div>

              <div className="form-grid mb-4">
                <div className="form-group">
                  <label htmlFor="type_projet" className="form-label">
                    Type de Projet <span className="span-e">*</span>
                  </label>
                  <select
                    id="type_projet"
                    name="type_projet"
                    value={formData.type_projet}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="infrastructure">Infrastructure</option>
                    <option value="social">Social</option>
                    <option value="formation">Formation</option>
                    <option value="urgence">Urgence</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="priorite" className="form-label">
                    Priorité <span className="span-e">*</span>
                  </label>
                  <select
                    id="priorite"
                    name="priorite"
                    value={formData.priorite}
                    onChange={handleInputChange}
                    className="form-select"
                  >
                    <option value="basse">Basse</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="haute">Haute</option>
                    <option value="critique">Critique</option>
                  </select>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="description" className="form-label">
                    Description du Projet
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Décrivez le projet en détail..."
                    rows={4}
                    required
                  />
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>
              </div>
            </div>

            {/* Section Localisation */}
            <div className="form-section">
              <div className="section-header">
                <IoLocationOutline className="section-icon" />
                <h4>Localisation</h4>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="localisation" className="form-label">
                    Localisation <span className="span-e">*</span>
                  </label>
                  <div className="location-input-group">
                    <input
                      type="text"
                      id="localisation"
                      name="localisation"
                      value={formData.localisation}
                      onChange={handleInputChange}
                      className={`form-input ${errors.localisation ? 'error' : ''}`}
                      placeholder="Adresse ou lieu du projet"
                      required
                    />
                    <button
                      type="button"
                      className="btn-geolocation"
                      onClick={handleGeolocation}
                      title="Utiliser ma position actuelle"
                    >
                      <IoMapOutline />
                    </button>
                  </div>
                  {errors.localisation && <span className="error-message">{errors.localisation}</span>}
                </div>

                {(formData.latitude && formData.longitude) && (
                  <div className="form-group full-width">
                    <div className="coordinates-display">
                      <span className="coordinate">
                        <strong>Latitude:</strong> {formData.latitude.toFixed(6)}
                      </span>
                      <span className="coordinate">
                        <strong>Longitude:</strong> {formData.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Section Budget et Dates */}
            <div className="form-section">
              <div className="section-header">
                <IoCashOutline className="section-icon" />
                <h4>Budget et Planning</h4>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="budget_prevue" className="form-label">
                    Budget Prévu (FCFA)
                  </label>
                  <input
                    type="number"
                    id="budget_prevue"
                    name="budget_prevue"
                    value={formData.budget_prevue}
                    onChange={handleInputChange}
                    className={`form-input ${errors.budget_prevue ? 'error' : ''}`}
                    placeholder="0"
                    min="0"
                    step="1000"
                    required
                  />
                  {errors.budget_prevue && <span className="error-message">{errors.budget_prevue}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="budget_depense" className="form-label">
                    Budget Dépensé (FCFA)
                  </label>
                  <input
                    type="number"
                    id="budget_depense"
                    name="budget_depense"
                    value={formData.budget_depense}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div className="mt-4 form-grid">
                <div className="form-group">
                  <label htmlFor="date_debut_prevue" className="form-label">
                    Date Début Prévue
                  </label>
                  <input
                    type="date"
                    id="date_debut_prevue"
                    name="date_debut_prevue"
                    value={formData.date_debut_prevue}
                    onChange={(e) => handleDateChange('date_debut_prevue', e.target.value)}
                    className={`form-input ${errors.date_debut_prevue ? 'error' : ''}`}
                    required
                  />
                  {errors.date_debut_prevue && <span className="error-message">{errors.date_debut_prevue}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="date_fin_prevue" className="form-label">
                    Date Fin Prévue
                  </label>
                  <input
                    type="date"
                    id="date_fin_prevue"
                    name="date_fin_prevue"
                    value={formData.date_fin_prevue}
                    onChange={(e) => handleDateChange('date_fin_prevue', e.target.value)}
                    className={`form-input ${errors.date_fin_prevue ? 'error' : ''}`}
                    required
                  />
                  {errors.date_fin_prevue && <span className="error-message">{errors.date_fin_prevue}</span>}
                </div>
              </div>

              {/* Dates Réelles */}
              <div className="mt-4">
                <div className="real-dates-header">
                  <button
                    type="button"
                    className="btn-toggle-dates"
                    onClick={() => setShowRealDates(!showRealDates)}
                  >
                    <IoTimeOutline />
                    {showRealDates ? 'Masquer' : 'Afficher'} les dates réelles
                  </button>
                </div>

                {showRealDates && (
                  <div className="form-grid mt-3">
                    <div className="form-group">
                      <label htmlFor="date_debut_reelle" className="form-label">
                        Date Début Réelle
                      </label>
                      <input
                        type="date"
                        id="date_debut_reelle"
                        name="date_debut_reelle"
                        value={formData.date_debut_reelle}
                        onChange={(e) => handleDateChange('date_debut_reelle', e.target.value)}
                        className={`form-input ${errors.date_debut_reelle ? 'error' : ''}`}
                      />
                      {errors.date_debut_reelle && <span className="error-message">{errors.date_debut_reelle}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="date_fin_reelle" className="form-label">
                        Date Fin Réelle
                      </label>
                      <input
                        type="date"
                        id="date_fin_reelle"
                        name="date_fin_reelle"
                        value={formData.date_fin_reelle}
                        onChange={(e) => handleDateChange('date_fin_reelle', e.target.value)}
                        className={`form-input ${errors.date_fin_reelle ? 'error' : ''}`}
                      />
                      {errors.date_fin_reelle && <span className="error-message">{errors.date_fin_reelle}</span>}
                    </div>
                  </div>
                )}
              </div>

              {/* Date de création (lecture seule) */}
              {isEditMode && (
                <div className="mt-4 form-group full-width">
                  <label htmlFor="date_creation" className="form-label">
                    Date de Création
                  </label>
                  <input
                    type="date"
                    id="date_creation"
                    name="date_creation"
                    value={formData.date_creation}
                    onChange={(e) => handleDateChange('date_creation', e.target.value)}
                    className="form-input"
                    readOnly
                  />
                  <small className="form-help">
                    Cette date est générée automatiquement lors de la création du projet
                  </small>
                </div>
              )}
            </div>

            {/* Section Responsables et État */}
            <div className="form-section">
                <div className="section-header">
                    <IoPeopleOutline className="section-icon" />
                    <h4>Responsables et État</h4>
                </div>

                <div className="form-grid">
                    <div className="form-group">
                    <label htmlFor="id_utilisateur_responsable" className="form-label">
                        Responsable du Projet
                    </label>
                    <select
                        id="id_utilisateur_responsable"
                        name="id_utilisateur_responsable"
                        value={formData.id_utilisateur_responsable}
                        onChange={handleInputChange}
                        className={`form-select ${errors.id_utilisateur_responsable ? 'error' : ''}`}
                        required
                    >
                        <option value="">Sélectionnez un responsable</option>
                        {utilisateurs.map(user => (
                        <option key={user.id_utilisateur} value={user.id_utilisateur}>
                            {user.prenom} {user.nom} - {user.email}
                        </option>
                        ))}
                    </select>
                    {errors.id_utilisateur_responsable && <span className="error-message">{errors.id_utilisateur_responsable}</span>}
                    </div>

                    <div className="form-group">
                    <label htmlFor="etat" className="form-label">
                        État du Projet <span className="span-e">*</span>
                    </label>
                    <select
                        id="etat"
                        name="etat"
                        value={formData.etat}
                        onChange={handleEtatChange}
                        className="form-select"
                    >
                        <option value="planifie">Planifié</option>
                        <option value="en_cours">En Cours</option>
                        <option value="suspendu">Suspendu</option>
                        <option value="termine">Terminé</option>
                        <option value="annule">Annulé</option>
                    </select>
                    </div>
                </div>

                <div className="mt-4 form-group full-width">
                  <div className="progress-header">
                    <label htmlFor="pourcentage_avancement" className="form-label">
                      Pourcentage d'Avancement (%)
                    </label>
                    <button
                      type="button"
                      className="btn-auto-progress"
                      onClick={handleAutoProgress}
                      title="Calculer automatiquement basé sur les dates"
                    >
                      <IoCalendarOutline />
                      Calcul auto
                    </button>
                  </div>
                  <input
                    type="number"
                    id="pourcentage_avancement"
                    name="pourcentage_avancement"
                    value={formData.pourcentage_avancement}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                  <div className="progress-indicator">
                    <div 
                      className="progress-bar" 
                      style={{width: `${formData.pourcentage_avancement}%`}}
                    ></div>
                  </div>
                </div>
            </div>

            {/* Actions du formulaire */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                <IoCloseOutline />
                Annuler
              </button>
              
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    {isEditMode ? 'Modification...' : 'Création...'}
                  </>
                ) : (
                  <>
                    <IoSaveOutline />
                    {isEditMode ? 'Modifier le Projet' : 'Créer le Projet'}
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

export default FrmProjet;