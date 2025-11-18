import React, { useState, useEffect } from 'react';
import './DetailProjet.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoArrowBackOutline,
  IoLocationOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoFlagOutline,
  IoDocumentTextOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoPlayCircleOutline,
  IoPauseCircleOutline,
  IoEyeOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoStatsChartOutline,
  IoMapOutline,
  IoDocumentAttachOutline
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
  id_projet: number;
  reference: string;
  nom: string;
  description: string;
  type_projet: 'infrastructure' | 'social' | 'formation' | 'urgence';
  localisation: string;
  budget_prevue: number;
  budget_depense: number;
  date_debut_prevue: string;
  date_fin_prevue: string;
  date_debut_reelle: string | null;
  date_fin_reelle: string | null;
  etat: 'planifie' | 'en_cours' | 'suspendu' | 'termine' | 'annule';
  pourcentage_avancement: number;
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  date_creation: string;
  responsable: string;
  region: string;
  est_en_retard: boolean;
  latitude?: number | null;
  longitude?: number | null;
}

interface Document {
  id: number;
  nom: string;
  type: string;
  taille: string;
  date_upload: string;
}

const DetailProjet: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [projet, setProjet] = useState<Projet | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('general');
  const [documents, setDocuments] = useState<Document[]>([]);

  // Données mock basées sur l'ID
  useEffect(() => {
    const mockProjets: Projet[] = [
      {
        id_projet: 1,
        reference: 'PROJ-2024-001',
        nom: 'Construction École Primaire',
        description: 'Construction d\'une école primaire moderne de 6 classes avec équipements numériques, bibliothèque et terrain de sport. Ce projet vise à améliorer l\'accès à l\'éducation dans la région de Thiès.',
        type_projet: 'infrastructure',
        localisation: 'Village M\'Bour, Région de Thiès',
        budget_prevue: 250000000,
        budget_depense: 185000000,
        date_debut_prevue: '2024-01-15',
        date_fin_prevue: '2024-06-30',
        date_debut_reelle: '2024-01-20',
        date_fin_reelle: null,
        etat: 'en_cours',
        pourcentage_avancement: 74,
        priorite: 'haute',
        date_creation: '2023-12-10',
        responsable: 'Jean Dupont',
        region: 'Thiès',
        est_en_retard: false,
        latitude: 14.7167,
        longitude: -17.4677
      },
      {
        id_projet: 2,
        reference: 'PROJ-2024-002',
        nom: 'Formation Agricole Durable',
        description: 'Programme de formation aux techniques agricoles durables pour 500 agriculteurs de la région de Fatick. Formation sur l\'irrigation, la rotation des cultures et l\'utilisation responsable des ressources.',
        type_projet: 'formation',
        localisation: 'Région de Fatick',
        budget_prevue: 75000000,
        budget_depense: 68000000,
        date_debut_prevue: '2024-02-01',
        date_fin_prevue: '2024-05-31',
        date_debut_reelle: '2024-02-05',
        date_fin_reelle: null,
        etat: 'en_cours',
        pourcentage_avancement: 85,
        priorite: 'moyenne',
        date_creation: '2023-11-20',
        responsable: 'Marie Fall',
        region: 'Fatick',
        est_en_retard: true
      }
    ];

    const mockDocuments: Document[] = [
      { id: 1, nom: 'Rapport d\'avancement Q1 2024', type: 'PDF', taille: '2.4 MB', date_upload: '2024-03-15' },
      { id: 2, nom: 'Étude de faisabilité technique', type: 'PDF', taille: '5.7 MB', date_upload: '2024-01-10' },
      { id: 3, nom: 'Photos chantier - Avril 2024', type: 'ZIP', taille: '15.2 MB', date_upload: '2024-04-20' },
      { id: 4, nom: 'Contrat prestataire principal', type: 'DOCX', taille: '1.8 MB', date_upload: '2023-12-15' },
      { id: 5, nom: 'Plan architectural final', type: 'DWG', taille: '8.9 MB', date_upload: '2024-02-28' }
    ];

    // Simuler le chargement des données
    setTimeout(() => {
      const projetTrouve = mockProjets.find(p => p.id_projet === parseInt(id || '1'));
      setProjet(projetTrouve || mockProjets[0]);
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Formatage de la date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Formatage du budget
  const formatBudget = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  };

  // Calcul du pourcentage de budget utilisé
  const calculerPourcentageBudget = (budgetPrevu: number, budgetDepense: number): number => {
    return budgetPrevu > 0 ? (budgetDepense / budgetPrevu) * 100 : 0;
  };

  // Calcul du temps restant
  const calculerTempsRestant = (dateFin: string): string => {
    const aujourdhui = new Date();
    const fin = new Date(dateFin);
    const diffTime = fin.getTime() - aujourdhui.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Terminé';
    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return '1 jour';
    return `${diffDays} jours`;
  };

  // Navigation
  const handleRetour = () => {
    navigate('/projetListes');
  };

  if (loading) {
    return (
      <div className="detail-projet-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des détails du projet...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!projet) {
    return (
      <div className="detail-projet-container">
        <div className="right-content w-100">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Projet non trouvé</h3>
            <p>Le projet que vous recherchez n'existe pas ou a été supprimé.</p>
            <button className="btn-retour" onClick={handleRetour}>
              <IoArrowBackOutline />
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-projet-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <button 
              type="button"
              className="btn-back" 
              onClick={handleRetour}
              aria-label="Retour à la liste des projets"
            >
              <IoArrowBackOutline />
            </button>
            <div>
              <h5 className="mb-0">Détails du Projet</h5>
              <p className="mb-0 subtitle">{projet.nom}</p>
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
                label="Détails"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* En-tête du projet */}
        <div className="projet-header-section">
          <div className="projet-main-info">
            <div className="projet-avatar">
              {projet.type_projet === 'infrastructure' && <IoLocationOutline />}
              {projet.type_projet === 'social' && <IoPeopleOutline />}
              {projet.type_projet === 'formation' && <IoDocumentTextOutline />}
              {projet.type_projet === 'urgence' && <IoAlertCircleOutline />}
            </div>
            <div className="projet-title-section">
              <h1 className="projet-title">{projet.nom}</h1>
              <div className="projet-meta">
                <span className="reference">{projet.reference}</span>
                <span className="type-projet">{projet.type_projet}</span>
                <span className={`badge etat ${projet.etat}`}>
                  {projet.etat === 'en_cours' && <IoPlayCircleOutline />}
                  {projet.etat === 'termine' && <IoCheckmarkCircleOutline />}
                  {projet.etat === 'planifie' && <IoTimeOutline />}
                  {projet.etat === 'suspendu' && <IoPauseCircleOutline />}
                  {projet.etat.charAt(0).toUpperCase() + projet.etat.slice(1).replace('_', ' ')}
                </span>
                <span className={`badge priorite ${projet.priorite}`}>
                  <IoFlagOutline />
                  {projet.priorite.charAt(0).toUpperCase() + projet.priorite.slice(1)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            <button className="btn-action secondary">
              <IoDownloadOutline />
              Exporter
            </button>
            <button className="btn-action primary">
              <IoPrintOutline />
              Imprimer
            </button>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            <IoDocumentTextOutline />
            Informations Générales
          </button>
          <button 
            className={`tab-button ${activeTab === 'budget' ? 'active' : ''}`}
            onClick={() => setActiveTab('budget')}
          >
            <IoCashOutline />
            Budget & Finance
          </button>
          <button 
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <IoDocumentAttachOutline />
            Documents
          </button>
          <button 
            className={`tab-button ${activeTab === 'statistiques' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistiques')}
          >
            <IoStatsChartOutline />
            Statistiques
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {/* Onglet Informations Générales */}
          {activeTab === 'general' && (
            <div className="tab-panel active">
              <div className="info-grid">
                <div className="info-card large">
                  <h3 className="card-title">
                    <IoDocumentTextOutline />
                    Description du Projet
                  </h3>
                  <p className="description">{projet.description}</p>
                </div>

                <div className="info-card">
                  <h3 className="card-title">
                    <IoLocationOutline />
                    Localisation
                  </h3>
                  <div className="info-item">
                    <p>
                        <span className="label">Localisation:</span> <br />
                        <span className="value">{projet.localisation}</span>
                    </p>
                  </div>
                  <div className="info-item">
                    <span className="label">Région:</span>
                    <span className="value">{projet.region}</span>
                  </div>
                  {projet.latitude && projet.longitude && (
                    <button className="btn-map">
                      <IoMapOutline />
                      Voir sur la carte
                    </button>
                  )}
                </div>

                <div className="info-card">
                  <h3 className="card-title">
                    <IoCalendarOutline />
                    Planning
                  </h3>
                  <div className="info-item">
                    <span className="label">Début prévu:</span>
                    <span className="value">{formatDate(projet.date_debut_prevue)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Fin prévue:</span>
                    <span className="value">{formatDate(projet.date_fin_prevue)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Début réel:</span>
                    <span className="value">
                      {projet.date_debut_reelle ? formatDate(projet.date_debut_reelle) : 'Non débuté'}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="label">Fin réelle:</span>
                    <span className="value">
                      {projet.date_fin_reelle ? formatDate(projet.date_fin_reelle) : 'En cours'}
                    </span>
                  </div>
                  <div className="info-item highlight">
                    <span className="label">Temps restant:</span>
                    <span className="value">{calculerTempsRestant(projet.date_fin_prevue)}</span>
                  </div>
                </div>

                <div className="info-card">
                  <h3 className="card-title">
                    <IoPeopleOutline />
                    Équipe
                  </h3>
                  <div className="info-item">
                    <span className="label">Responsable:</span>
                    <span className="value">{projet.responsable}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Date création:</span>
                    <span className="value">{formatDate(projet.date_creation)}</span>
                  </div>
                </div>

                <div className="info-card full-width">
                  <h3 className="card-title">
                    <IoStatsChartOutline />
                    Avancement du Projet
                  </h3>
                  <div className="progress-section">
                    <div className="progress-header">
                      <span className="progress-label">Progression globale</span>
                      <span className="progress-value">{projet.pourcentage_avancement}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${projet.priorite}`}
                        style={{width: `${projet.pourcentage_avancement}%`}}
                      ></div>
                    </div>
                    <div className="progress-stats">
                      <div className="stat">
                        <span className="stat-value">{projet.pourcentage_avancement}%</span>
                        <span className="stat-label">Complété</span>
                      </div>
                      <div className="stat">
                        <span className="stat-value">{100 - projet.pourcentage_avancement}%</span>
                        <span className="stat-label">Restant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Budget & Finance */}
          {activeTab === 'budget' && (
            <div className="tab-panel active">
              <div className="budget-grid">
                <div className="budget-card large">
                  <h3 className="card-title">
                    <IoCashOutline />
                    Aperçu du Budget
                  </h3>
                  <div className="budget-overview">
                    <div className="budget-item">
                      <span className="label">Budget prévu</span>
                      <span className="value budget-previous">{formatBudget(projet.budget_prevue)}</span>
                    </div>
                    <div className="budget-item">
                      <span className="label">Budget dépensé</span>
                      <span className="value budget-depense">{formatBudget(projet.budget_depense)}</span>
                    </div>
                    <div className="budget-item">
                      <span className="label">Budget restant</span>
                      <span className="value budget-restant">
                        {formatBudget(projet.budget_prevue - projet.budget_depense)}
                      </span>
                    </div>
                    <div className="budget-progress">
                      <div className="progress-header">
                        <span className="progress-label">Taux d'utilisation du budget</span>
                        <span className="progress-value">
                          {calculerPourcentageBudget(projet.budget_prevue, projet.budget_depense).toFixed(1)}%
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="budget-fill"
                          style={{width: `${calculerPourcentageBudget(projet.budget_prevue, projet.budget_depense)}%`}}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="budget-card">
                  <h3 className="card-title">Répartition par Catégorie</h3>
                  <div className="category-list">
                    <div className="category-item">
                      <span className="category-name">Main d'œuvre</span>
                      <span className="category-amount">{formatBudget(projet.budget_depense * 0.4)}</span>
                      <div className="category-bar">
                        <div className="category-fill" style={{width: '40%'}}></div>
                      </div>
                    </div>
                    <div className="category-item">
                      <span className="category-name">Matériaux</span>
                      <span className="category-amount">{formatBudget(projet.budget_depense * 0.35)}</span>
                      <div className="category-bar">
                        <div className="category-fill" style={{width: '35%'}}></div>
                      </div>
                    </div>
                    <div className="category-item">
                      <span className="category-name">Équipements</span>
                      <span className="category-amount">{formatBudget(projet.budget_depense * 0.15)}</span>
                      <div className="category-bar">
                        <div className="category-fill" style={{width: '15%'}}></div>
                      </div>
                    </div>
                    <div className="category-item">
                      <span className="category-name">Frais divers</span>
                      <span className="category-amount">{formatBudget(projet.budget_depense * 0.1)}</span>
                      <div className="category-bar">
                        <div className="category-fill" style={{width: '10%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Onglet Documents */}
          {activeTab === 'documents' && (
            <div className="tab-panel active">
              <div className="documents-header">
                <h3>Documents du Projet</h3>
                <button className="btn-upload">
                  <IoDocumentAttachOutline />
                  Ajouter un document
                </button>
              </div>
              
              <div className="documents-grid">
                {documents.map(doc => (
                  <div key={doc.id} className="document-card">
                    <div className="document-icon">
                      <IoDocumentTextOutline />
                    </div>
                    <div className="document-info">
                      <h4 className="document-name">{doc.nom}</h4>
                      <div className="document-meta">
                        <span className="document-type">{doc.type}</span>
                        <span className="document-size">{doc.taille}</span>
                        <span className="document-date">{formatDate(doc.date_upload)}</span>
                      </div>
                    </div>
                    <div className="document-actions">
                      <button className="btn-download" title="Télécharger">
                        <IoDownloadOutline />
                      </button>
                      <button className="btn-preview" title="Aperçu">
                        <IoEyeOutline />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Onglet Statistiques */}
          {activeTab === 'statistiques' && (
            <div className="tab-panel active">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">
                    <IoTimeOutline />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{calculerTempsRestant(projet.date_fin_prevue)}</span>
                    <span className="stat-label">Temps restant</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <IoCashOutline />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      {calculerPourcentageBudget(projet.budget_prevue, projet.budget_depense).toFixed(1)}%
                    </span>
                    <span className="stat-label">Budget utilisé</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <IoStatsChartOutline />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">{projet.pourcentage_avancement}%</span>
                    <span className="stat-label">Avancement global</span>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-icon">
                    <IoAlertCircleOutline />
                  </div>
                  <div className="stat-info">
                    <span className="stat-value">
                      {projet.est_en_retard ? 'En retard' : 'Dans les temps'}
                    </span>
                    <span className="stat-label">Statut délai</span>
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

export default DetailProjet;