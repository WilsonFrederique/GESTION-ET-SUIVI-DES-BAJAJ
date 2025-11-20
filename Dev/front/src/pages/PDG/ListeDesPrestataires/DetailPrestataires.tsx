import React, { useState, useEffect } from 'react';
import './DetailPrestataires.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoBusinessOutline,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoDocumentTextOutline,
  IoStarOutline,
  IoStar,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoCalendarOutline,
  IoArrowBackOutline,
  IoPencilOutline,
  IoPrintOutline,
  IoShareOutline,
  IoDownloadOutline,
  IoGlobeOutline,
  IoCardOutline,
  IoStatsChartOutline
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

// Interface TypeScript
interface Prestataire {
  id_prestataire: number;
  raison_sociale: string;
  type_entreprise: 'SARL' | 'SA' | 'EI' | 'ONG' | 'Association';
  siret: string;
  adresse: string;
  telephone: string;
  email: string;
  domaine_competence: string;
  date_inscription: string;
  est_certifie: boolean;
  note_moyenne: number;
  region: string;
  est_actif: boolean;
}

const DetailPrestataires: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [prestataire, setPrestataire] = useState<Prestataire | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('informations');

  // Données mock basées sur votre structure
  useEffect(() => {
    const mockPrestataires: Prestataire[] = [
      {
        id_prestataire: 1,
        raison_sociale: 'Tech Solutions SARL',
        type_entreprise: 'SARL',
        siret: '12345678901234',
        adresse: '123 Rue de la Tech, 75001 Paris',
        telephone: '+33 1 23 45 67 89',
        email: 'contact@techsolutions.fr',
        domaine_competence: 'Développement Logiciel',
        date_inscription: '2023-01-15',
        est_certifie: true,
        note_moyenne: 4.5,
        region: 'Île-de-France',
        est_actif: true
      },
      {
        id_prestataire: 2,
        raison_sociale: 'Green Energy SA',
        type_entreprise: 'SA',
        siret: '98765432109876',
        adresse: '456 Avenue Verte, 69002 Lyon',
        telephone: '+33 4 76 54 32 10',
        email: 'info@greenenergy.fr',
        domaine_competence: 'Énergies Renouvelables',
        date_inscription: '2023-03-20',
        est_certifie: true,
        note_moyenne: 4.2,
        region: 'Auvergne-Rhône-Alpes',
        est_actif: true
      },
      {
        id_prestataire: 3,
        raison_sociale: 'Creative Design EI',
        type_entreprise: 'EI',
        siret: '56789012345678',
        adresse: '789 Boulevard Créatif, 13001 Marseille',
        telephone: '+33 4 91 23 45 67',
        email: 'hello@creativedesign.fr',
        domaine_competence: 'Design Graphique',
        date_inscription: '2023-02-10',
        est_certifie: false,
        note_moyenne: 4.0,
        region: "Provence-Alpes-Côte d'Azur",
        est_actif: true
      },
      {
        id_prestataire: 4,
        raison_sociale: 'Solidarité Environnement ONG',
        type_entreprise: 'ONG',
        siret: '34567890123456',
        adresse: '101 Rue Écologique, 31000 Toulouse',
        telephone: '+33 5 61 23 45 67',
        email: 'contact@solidarite-environnement.org',
        domaine_competence: 'Protection Environnementale',
        date_inscription: '2022-11-05',
        est_certifie: true,
        note_moyenne: 4.8,
        region: 'Occitanie',
        est_actif: true
      },
      {
        id_prestataire: 5,
        raison_sociale: 'Build Plus Association',
        type_entreprise: 'Association',
        siret: '23456789012345',
        adresse: '202 Avenue Construction, 59000 Lille',
        telephone: '+33 3 20 12 34 56',
        email: 'contact@buildplus.org',
        domaine_competence: 'Construction Durable',
        date_inscription: '2023-04-18',
        est_certifie: false,
        note_moyenne: 3.8,
        region: 'Hauts-de-France',
        est_actif: false
      }
    ];

    // Simuler le chargement des données
    setTimeout(() => {
      const foundPrestataire = mockPrestataires.find(p => p.id_prestataire === Number(id));
      setPrestataire(foundPrestataire || null);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Navigation
  const handleBack = (): void => {
    navigate('/listeDesPrestataires');
  };

  const handleModifier = (): void => {
    if (prestataire) {
      navigate(`/modifier-prestataire/${prestataire.id_prestataire}`, {
        state: { prestataire }
      });
    }
  };

  // Formatage de la date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Affichage des étoiles pour la note
  const renderStars = (note: number): JSX.Element[] => {
    const stars = [];
    const fullStars = Math.floor(note);
    const hasHalfStar = note % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<IoStar key={i} className="star filled" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<IoStar key={i} className="star half" />);
      } else {
        stars.push(<IoStarOutline key={i} className="star" />);
      }
    }
    return stars;
  };

  // Statistiques simulées
  const statistiques = {
    projetsRealises: 24,
    contratsActifs: 3,
    tauxSatisfaction: 92,
    delaiMoyen: '15 jours'
  };

  if (loading) {
    return (
      <div className="detail-prestataires-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des détails du prestataire...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prestataire) {
    return (
      <div className="detail-prestataires-container">
        <div className="right-content w-100">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h3>Prestataire non trouvé</h3>
            <p>Le prestataire que vous recherchez n'existe pas ou a été supprimé.</p>
            <button className="btn-primary" onClick={handleBack}>
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-prestataires-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <button 
              type="button"
              className="btn-back" 
              onClick={handleBack}
              aria-label="Retour à la liste des prestataires"
            >
              <IoArrowBackOutline />
            </button>
            <div>
              <h5 className="mb-0">Détails du Prestataire</h5>
              <p className="mb-0 subtitle">Informations complètes et statistiques</p>
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
                label="Détails Prestataire"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* En-tête du prestataire */}
        <div className="card shadow border-0 p-4 mt-4 prestataire-header">
          <div className="prestataire-main-info">
            <div className="prestataire-avatar">
              <IoBusinessOutline />
            </div>
            <div className="prestataire-title-section">
              <div className="title-row">
                <h1 className="prestataire-title">{prestataire.raison_sociale}</h1>
                <div className="status-badges">
                  {prestataire.est_certifie && (
                    <span className="badge certified">
                      <IoCheckmarkCircleOutline />
                      Certifié
                    </span>
                  )}
                  <span className={`badge status ${prestataire.est_actif ? 'active' : 'inactive'}`}>
                    {prestataire.est_actif ? 'Actif' : 'Inactif'}
                  </span>
                  <span className="badge type">
                    {prestataire.type_entreprise}
                  </span>
                </div>
              </div>
              
              <div className="prestataire-meta">
                <span className="domaine">
                  <IoDocumentTextOutline />
                  {prestataire.domaine_competence}
                </span>
                
                <span className="region">
                  <IoLocationOutline />
                  {prestataire.region}
                </span>

                <span className="rating">
                  <div className="stars">
                    {renderStars(prestataire.note_moyenne)}
                    <span className="rating-value">({prestataire.note_moyenne.toFixed(1)})</span>
                  </div>
                </span>
              </div>
            </div>
          </div>
          
          <div className="prestataire-actions">
            <button 
              className="btn-action secondary"
              onClick={handleModifier}
              title="Modifier"
            >
              <IoPencilOutline />
              Modifier
            </button>
            
            <button 
              className="btn-action secondary"
              onClick={() => window.print()}
              title="Imprimer"
            >
              <IoPrintOutline />
              Imprimer
            </button>

            <button 
              className="btn-action primary"
              title="Télécharger PDF"
            >
              <IoDownloadOutline />
              PDF
            </button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'informations' ? 'active' : ''}`}
            onClick={() => setActiveTab('informations')}
          >
            <IoBusinessOutline />
            Informations
          </button>
          <button 
            className={`tab-button ${activeTab === 'statistiques' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistiques')}
          >
            <IoStatsChartOutline />
            Statistiques
          </button>
          <button 
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <IoDocumentTextOutline />
            Documents
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {activeTab === 'informations' && (
            <div className="informations-tab">
              <div className="grid-layout">
                {/* Informations principales */}
                <div className="bgColor card shadow border-0 p-4">
                  <div className="section-header">
                    <IoBusinessOutline className="section-icon" />
                    <h4>Informations de l'entreprise</h4>
                  </div>
                  
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Raison sociale</label>
                      <span className="info-value">{prestataire.raison_sociale}</span>
                    </div>
                    
                    <div className="info-item">
                      <label>Type d'entreprise</label>
                      <span className="info-value">{prestataire.type_entreprise}</span>
                    </div>
                    
                    <div className="info-item">
                      <label>Numéro SIRET</label>
                      <span className="info-value">{prestataire.siret}</span>
                    </div>
                    
                    <div className="info-item">
                      <label>Domaine de compétence</label>
                      <span className="info-value">{prestataire.domaine_competence}</span>
                    </div>
                    
                    <div className="info-item">
                      <label>Date d'inscription</label>
                      <span className="info-value">{formatDate(prestataire.date_inscription)}</span>
                    </div>
                    
                    <div className="info-item">
                      <label>Région</label>
                      <span className="info-value">{prestataire.region}</span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bgColor card shadow border-0 p-4">
                  <div className="section-header">
                    <IoMailOutline className="section-icon" />
                    <h4>Coordonnées</h4>
                  </div>
                  
                  <div className="contact-info">
                    <div className="contact-item">
                      <div className="contact-icon">
                        <IoMailOutline />
                      </div>
                      <div className="contact-details">
                        <label>Email</label>
                        <span className="contact-value">{prestataire.email}</span>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <div className="contact-icon">
                        <IoCallOutline />
                      </div>
                      <div className="contact-details">
                        <label>Téléphone</label>
                        <span className="contact-value">{prestataire.telephone}</span>
                      </div>
                    </div>
                    
                    <div className="contact-item">
                      <div className="contact-icon">
                        <IoLocationOutline />
                      </div>
                      <div className="contact-details">
                        <label>Adresse</label>
                        <span className="contact-value">{prestataire.adresse}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            {/* Évaluation */}
            <div className="bgColor mt-4 card shadow border-0 p-4">
                <div className="section-header">
                <IoStarOutline className="section-icon" />
                <h4>Évaluation</h4>
                </div>
                
                <div className="evaluation-content">
                <div className="rating-display">
                    <div className="rating-score">
                    <span className="score">{prestataire.note_moyenne.toFixed(1)}</span>
                    <span className="score-max">/5</span>
                    </div>
                    <div className="stars-large">
                    {renderStars(prestataire.note_moyenne)}
                    </div>
                    <div className="rating-text">
                    Note moyenne basée sur 12 évaluations
                    </div>
                </div>
                
                <div className="rating-details">
                    <div className="rating-bar">
                    <label>5 étoiles</label>
                    <div className="bar-container">
                        <div className="bar-fill" style={{width: '70%'}}></div>
                    </div>
                    <span>70%</span>
                    </div>
                    <div className="rating-bar">
                    <label>4 étoiles</label>
                    <div className="bar-container">
                        <div className="bar-fill" style={{width: '20%'}}></div>
                    </div>
                    <span>20%</span>
                    </div>
                    <div className="rating-bar">
                    <label>3 étoiles</label>
                    <div className="bar-container">
                        <div className="bar-fill" style={{width: '8%'}}></div>
                    </div>
                    <span>8%</span>
                    </div>
                    <div className="rating-bar">
                    <label>2 étoiles</label>
                    <div className="bar-container">
                        <div className="bar-fill" style={{width: '2%'}}></div>
                    </div>
                    <span>2%</span>
                    </div>
                    <div className="rating-bar">
                    <label>1 étoile</label>
                    <div className="bar-container">
                        <div className="bar-fill" style={{width: '0%'}}></div>
                    </div>
                    <span>0%</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
          )}

          {activeTab === 'statistiques' && (
            <div className="statistiques-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon total">
                    <IoDocumentTextOutline />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">{statistiques.projetsRealises}</span>
                    <span className="stat-label">Projets réalisés</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon active">
                    <IoPeopleOutline />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">{statistiques.contratsActifs}</span>
                    <span className="stat-label">Contrats actifs</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon certified">
                    <IoStarOutline />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">{statistiques.tauxSatisfaction}%</span>
                    <span className="stat-label">Taux de satisfaction</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon rating">
                    <IoTimeOutline />
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">{statistiques.delaiMoyen}</span>
                    <span className="stat-label">Délai moyen</span>
                  </div>
                </div>
              </div>

              {/* Graphiques et statistiques détaillées */}
              <div className="card shadow border-0 p-4 mt-4">
                <div className="section-header">
                  <IoStatsChartOutline className="section-icon" />
                  <h4>Performance mensuelle</h4>
                </div>
                <div className="chart-placeholder">
                  <div className="chart-message">
                    <IoStatsChartOutline className="chart-icon" />
                    <p>Graphique de performance</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="documents-tab">
              <div className="card shadow border-0 p-4">
                <div className="section-header">
                  <IoDocumentTextOutline className="section-icon" />
                  <h4>Documents associés</h4>
                </div>
                
                <div className="documents-list">
                  <div className="document-item">
                    <div className="document-icon">
                      <IoCardOutline />
                    </div>
                    <div className="document-info">
                      <h5>Certification ISO 9001</h5>
                      <p>Document de certification qualité</p>
                      <span className="document-date">Ajouté le 15/03/2023</span>
                    </div>
                    <button className="btn-download">
                      <IoDownloadOutline />
                    </button>
                  </div>
                  
                  <div className="document-item">
                    <div className="document-icon">
                      <IoDocumentTextOutline />
                    </div>
                    <div className="document-info">
                      <h5>Contrat cadre</h5>
                      <p>Contrat de partenariat signé</p>
                      <span className="document-date">Ajouté le 10/01/2023</span>
                    </div>
                    <button className="btn-download">
                      <IoDownloadOutline />
                    </button>
                  </div>
                  
                  <div className="document-item">
                    <div className="document-icon">
                      <IoGlobeOutline />
                    </div>
                    <div className="document-info">
                      <h5>Attestation d'assurance</h5>
                      <p>Document d'assurance responsabilité civile</p>
                      <span className="document-date">Ajouté le 05/12/2022</span>
                    </div>
                    <button className="btn-download">
                      <IoDownloadOutline />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default DetailPrestataires;