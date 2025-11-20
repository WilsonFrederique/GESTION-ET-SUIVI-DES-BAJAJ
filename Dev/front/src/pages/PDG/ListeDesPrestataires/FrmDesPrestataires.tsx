import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import './FrmDesPrestataires.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoBusinessOutline,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoDocumentTextOutline,
  IoAddCircleOutline,
  IoArrowBackOutline,
  IoCheckmarkCircleOutline,
  IoCardOutline,
  IoPencilOutline
} from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

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
interface PrestataireFormData {
  raison_sociale: string;
  type_entreprise: 'SARL' | 'SA' | 'EI' | 'ONG' | 'Association' | '';
  siret: string;
  adresse: string;
  telephone: string;
  email: string;
  domaine_competence: string;
  region: string;
  est_certifie: boolean;
  est_actif: boolean;
}

interface FormErrors {
  raison_sociale?: string;
  type_entreprise?: string;
  siret?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  domaine_competence?: string;
  region?: string;
}

const FrmDesPrestataires: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isEditMode = Boolean(id);
  
  // États avec types explicites
  const [formData, setFormData] = useState<PrestataireFormData>({
    raison_sociale: '',
    type_entreprise: '',
    siret: '',
    adresse: '',
    telephone: '',
    email: '',
    domaine_competence: '',
    region: '',
    est_certifie: false,
    est_actif: true
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Charger les données du prestataire en mode édition
  useEffect(() => {
    if (isEditMode && location.state?.prestataire) {
      setFormData(location.state.prestataire);
    }
  }, [isEditMode, location.state]);

  // Options pour les sélecteurs
  const typesEntreprise = ['SARL', 'SA', 'EI', 'ONG', 'Association'];
  const domainesCompetence = [
    'Développement Logiciel',
    'Énergies Renouvelables',
    'Design Graphique',
    'Protection Environnementale',
    'Construction Durable',
    'Consulting',
    'Formation',
    'Maintenance',
    'Sécurité',
    'Transport'
  ];
  const regions = [
    'Île-de-France',
    'Auvergne-Rhône-Alpes',
    "Provence-Alpes-Côte d'Azur",
    'Occitanie',
    'Hauts-de-France',
    'Grand Est',
    'Normandie',
    'Nouvelle-Aquitaine',
    'Pays de la Loire',
    'Bretagne',
    'Centre-Val de Loire',
    'Bourgogne-Franche-Comté'
  ];

  // Gestion des changements avec types
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    
    let newValue: string | boolean = value;

    if (type === 'checkbox') {
      newValue = (e.target as HTMLInputElement).checked;
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

    // Validation de la raison sociale
    if (!formData.raison_sociale.trim()) {
      newErrors.raison_sociale = 'La raison sociale est requise';
    } else if (formData.raison_sociale.length > 255) {
      newErrors.raison_sociale = 'La raison sociale ne peut pas dépasser 255 caractères';
    }

    // Validation du type d'entreprise
    if (!formData.type_entreprise) {
      newErrors.type_entreprise = 'Le type d\'entreprise est requis';
    }

    // Validation du SIRET
    if (formData.siret && !/^\d{14}$/.test(formData.siret)) {
      newErrors.siret = 'Le SIRET doit contenir exactement 14 chiffres';
    }

    // Validation de l'adresse
    if (!formData.adresse.trim()) {
      newErrors.adresse = 'L\'adresse est requise';
    }

    // Validation du téléphone
    if (formData.telephone && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.telephone)) {
      newErrors.telephone = 'Le numéro de téléphone n\'est pas valide';
    }

    // Validation de l'email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'L\'adresse email n\'est pas valide';
    }

    // Validation du domaine de compétence
    if (!formData.domaine_competence.trim()) {
      newErrors.domaine_competence = 'Le domaine de compétence est requis';
    }

    // Validation de la région
    if (!formData.region) {
      newErrors.region = 'La région est requise';
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
      await new Promise<void>(resolve => setTimeout(resolve, 2000));
      
      // Redirection après succès
      navigate('/listeDesPrestataires');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    navigate('/listeDesPrestataires');
  };

  // Rendu du composant
  return (
    <div className="frm-prestataires-container">
      <div className="right-content w-100">
        {/* En-tête */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <button 
              type="button"
              className="btn-back" 
              onClick={handleCancel}
              aria-label="Retour à la liste des prestataires"
            >
              <IoArrowBackOutline />
            </button>
            <div>
              <h5 className="mb-0">
                {isEditMode ? 'Modifier le prestataire' : 'Créer un nouveau prestataire'}
              </h5>
              <p className="mb-0 subtitle">
                {isEditMode ? 'Modifier les informations du prestataire' : 'Ajouter et configurer un nouveau prestataire'}
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
              <a href="/listeDesPrestataires">
                <StyledBreadcrumb
                  className="StyledBreadcrumb"
                  label="Liste des Prestataires"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </a>
              <StyledBreadcrumb
                className="StyledBreadcrumb"
                label={isEditMode ? "Modifier Prestataire" : "Nouveau Prestataire"}
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Formulaire Principal */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="prestataire-form" noValidate>
            <div className="form-grid">
              {/* Section: Informations de l'entreprise */}
              <div className="form-section">
                <div className="section-header">
                  <IoBusinessOutline className="section-icon" />
                  <h4>Informations de l'entreprise</h4>
                </div>
                
                <div className="form-group">
                  <label htmlFor="raison_sociale" className="form-label">
                    Raison sociale <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="raison_sociale"
                    name="raison_sociale"
                    value={formData.raison_sociale}
                    onChange={handleChange}
                    className={`form-input ${errors.raison_sociale ? 'error' : ''}`}
                    placeholder="Ex: Tech Solutions SARL"
                    maxLength={255}
                    required
                  />
                  {errors.raison_sociale && (
                    <span className="error-message" role="alert">{errors.raison_sociale}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="type_entreprise" className="form-label">
                      Type d'entreprise <span className="required">*</span>
                    </label>
                    <select
                      id="type_entreprise"
                      name="type_entreprise"
                      value={formData.type_entreprise}
                      onChange={handleChange}
                      className={`form-select ${errors.type_entreprise ? 'error' : ''}`}
                      required
                    >
                      <option value="">Sélectionnez un type</option>
                      {typesEntreprise.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    {errors.type_entreprise && (
                      <span className="error-message" role="alert">{errors.type_entreprise}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="siret" className="form-label">
                      Numéro SIRET
                    </label>
                    <input
                      type="text"
                      id="siret"
                      name="siret"
                      value={formData.siret}
                      onChange={handleChange}
                      className={`form-input ${errors.siret ? 'error' : ''}`}
                      placeholder="14 chiffres"
                      maxLength={14}
                    />
                    {errors.siret && (
                      <span className="error-message" role="alert">{errors.siret}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="domaine_competence" className="form-label">
                    Domaine de compétence <span className="required">*</span>
                  </label>
                  <select
                    id="domaine_competence"
                    name="domaine_competence"
                    value={formData.domaine_competence}
                    onChange={handleChange}
                    className={`form-select ${errors.domaine_competence ? 'error' : ''}`}
                    required
                  >
                    <option value="">Sélectionnez un domaine</option>
                    {domainesCompetence.map(domaine => (
                      <option key={domaine} value={domaine}>{domaine}</option>
                    ))}
                  </select>
                  {errors.domaine_competence && (
                    <span className="error-message" role="alert">{errors.domaine_competence}</span>
                  )}
                </div>
              </div>

              {/* Section: Contact et localisation */}
              <div className="form-section">
                <div className="section-header">
                  <IoLocationOutline className="section-icon" />
                  <h4>Contact et Localisation</h4>
                </div>

                <div className="form-group">
                  <label htmlFor="adresse" className="form-label">
                    Adresse complète <span className="required">*</span>
                  </label>
                  <textarea
                    id="adresse"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleChange}
                    rows={3}
                    className={`form-textarea ${errors.adresse ? 'error' : ''}`}
                    placeholder="Numéro, rue, code postal, ville..."
                    required
                  />
                  {errors.adresse && (
                    <span className="error-message" role="alert">{errors.adresse}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="region" className="form-label">
                      Région <span className="required">*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className={`form-select ${errors.region ? 'error' : ''}`}
                      required
                    >
                      <option value="">Sélectionnez une région</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                    {errors.region && (
                      <span className="error-message" role="alert">{errors.region}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="telephone" className="form-label">
                      Téléphone
                    </label>
                    <div className="input-with-icon">
                      <IoCallOutline className="input-icon" />
                      <input
                        type="tel"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleChange}
                        className={`form-input ${errors.telephone ? 'error' : ''}`}
                        placeholder="+33 1 23 45 67 89"
                      />
                    </div>
                    {errors.telephone && (
                      <span className="error-message" role="alert">{errors.telephone}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-with-icon">
                    <IoMailOutline className="input-icon" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="contact@entreprise.fr"
                    />
                  </div>
                  {errors.email && (
                    <span className="error-message" role="alert">{errors.email}</span>
                  )}
                </div>
              </div>

              {/* Section: Statut et certification */}
              <div className="form-section">
                <div className="section-header">
                  <IoDocumentTextOutline className="section-icon" />
                  <h4>Statut et Certification</h4>
                </div>

                <div className="form-row">
                  <div className="form-group checkbox-group">
                    <label htmlFor="est_certifie" className="checkbox-label">
                      <input
                        type="checkbox"
                        id="est_certifie"
                        name="est_certifie"
                        checked={formData.est_certifie}
                        onChange={handleChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      <div className="checkbox-info">
                        <span className="checkbox-title">Prestataire certifié</span>
                        <span className="checkbox-description">Ce prestataire dispose de certifications reconnues</span>
                      </div>
                    </label>
                  </div>

                  <div className="form-group checkbox-group">
                    <label htmlFor="est_actif" className="checkbox-label">
                      <input
                        type="checkbox"
                        id="est_actif"
                        name="est_actif"
                        checked={formData.est_actif}
                        onChange={handleChange}
                        className="checkbox-input"
                      />
                      <span className="checkbox-custom"></span>
                      <div className="checkbox-info">
                        <span className="checkbox-title">Prestataire actif</span>
                        <span className="checkbox-description">Ce prestataire peut être sélectionné pour de nouveaux projets</span>
                      </div>
                    </label>
                  </div>
                </div>

                {formData.est_certifie && (
                  <div className="certification-notice">
                    <IoCheckmarkCircleOutline className="notice-icon" />
                    <div className="notice-content">
                      <strong>Prestataire certifié</strong>
                      <p>Les informations de certification seront à compléter dans le profil du prestataire.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Résumé des informations */}
            <div className="form-summary">
              <div className="summary-header">
                <IoCardOutline className="summary-icon" />
                <h5>Résumé du prestataire</h5>
              </div>
              <div className="summary-content">
                <div className="summary-item">
                  <p><strong className='strong'>Raison sociale: <br /></strong>{formData.raison_sociale || 'Non renseigné'}</p>
                </div>
                <div className="summary-item">
                  <p><strong className='strong'>Type:</strong> <br />{formData.type_entreprise || 'Non renseigné'}</p>
                </div>
                <div className="summary-item">
                  <p><strong className='strong'>Domaine:</strong> <br />{formData.domaine_competence || 'Non renseigné'}</p>
                </div>
                <div className="summary-item">
                  <p><strong className='strong'>Région:</strong> <br />{formData.region || 'Non renseigné'}</p>
                </div>
                <div className="summary-item">
                  <p>
                    <strong className='strong'>Statut:</strong> <br />
                    <span className={`status ${formData.est_actif ? 'active' : 'inactive'}`}>
                        {formData.est_actif ? 'Actif' : 'Inactif'}
                    </span>
                  </p>
                </div>
                <div className="summary-item">
                  <p>
                    <strong className='strong'>Certification:</strong> <br />
                    <span className={`certification ${formData.est_certifie ? 'certified' : 'not-certified'}`}>
                        {formData.est_certifie ? 'Certifié' : 'Non certifié'}
                    </span>
                  </p>
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
                    {isEditMode ? 'Mise à jour en cours...' : 'Création en cours...'}
                  </>
                ) : (
                  <>
                    {isEditMode ? <IoPencilOutline /> : <IoAddCircleOutline />}
                    {isEditMode ? 'Mettre à jour' : 'Créer le prestataire'}
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

export default FrmDesPrestataires;