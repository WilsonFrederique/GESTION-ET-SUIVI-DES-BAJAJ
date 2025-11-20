import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import DashboardBoxProjet from '../../../pages/PDG/Dashboard/Componets/DashboardBoxProjet';
import DashboardBoxAlerts from '../../../pages/PDG/Dashboard/Componets/DashboardBoxAlerts';
import DashboardBoxBudget from '../../../pages/PDG/Dashboard/Componets/DashboardBoxBudget';
import DashboardBoxUsers from '../../../pages/PDG/Dashboard/Componets/DashboardBoxUsers';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoAddOutline,
  IoEyeOutline,
  IoDownloadOutline,
  IoRefreshOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
  IoPlayCircleOutline
} from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { MdWorkOutline } from "react-icons/md";
import { CiMoneyBill } from "react-icons/ci";
import { IoWarningOutline } from "react-icons/io5";
import ScrollToTop from '../../Helper/ScrollToTop';
import Footer from '../../Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';

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
interface DashboardStats {
  totalProjets: number;
  projetsEnCours: number;
  projetsTermines: number;
  projetsEnRetard: number;
  budgetTotal: number;
  budgetUtilise: number;
  prestatairesActifs: number;
  tauxCompletion: number;
}

interface ProjetRecent {
  id: number;
  nom: string;
  type: string;
  progression: number;
  statut: 'en_cours' | 'termine' | 'en_retard' | 'planifie';
  dateDebut: string;
  dateFin: string;
  budget: number;
}

const Dashboard: React.FC = () => {
  const [, setStats] = useState<DashboardStats>({
    totalProjets: 0,
    projetsEnCours: 0,
    projetsTermines: 0,
    projetsEnRetard: 0,
    budgetTotal: 0,
    budgetUtilise: 0,
    prestatairesActifs: 0,
    tauxCompletion: 0
  });

  const [projetsRecents, setProjetsRecents] = useState<ProjetRecent[]>([]);
  const [, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Données mock pour le dashboard
  useEffect(() => {
    const mockStats: DashboardStats = {
      totalProjets: 24,
      projetsEnCours: 12,
      projetsTermines: 8,
      projetsEnRetard: 4,
      budgetTotal: 1850000000,
      budgetUtilise: 985000000,
      prestatairesActifs: 45,
      tauxCompletion: 68
    };

    const mockProjets: ProjetRecent[] = [
      {
        id: 1,
        nom: 'Construction École Primaire',
        type: 'Infrastructure',
        progression: 74,
        statut: 'en_cours',
        dateDebut: '2024-01-15',
        dateFin: '2024-06-30',
        budget: 250000000
      },
      {
        id: 2,
        nom: 'Formation Agricole Durable',
        type: 'Formation',
        progression: 85,
        statut: 'en_cours',
        dateDebut: '2024-02-01',
        dateFin: '2024-05-31',
        budget: 75000000
      },
      {
        id: 3,
        nom: 'Centre de Santé Communautaire',
        type: 'Infrastructure',
        progression: 100,
        statut: 'termine',
        dateDebut: '2023-09-01',
        dateFin: '2024-01-31',
        budget: 180000000
      },
      {
        id: 4,
        nom: 'Programme Nutrition Infantile',
        type: 'Social',
        progression: 45,
        statut: 'en_retard',
        dateDebut: '2024-03-01',
        dateFin: '2024-08-31',
        budget: 45000000
      },
      {
        id: 5,
        nom: 'Intervention Urgence Inondations',
        type: 'Urgence',
        progression: 65,
        statut: 'en_cours',
        dateDebut: '2024-01-10',
        dateFin: '2024-03-31',
        budget: 120000000
      }
    ];

    setStats(mockStats);
    setProjetsRecents(mockProjets);
    setLoading(false);
  }, []);

  const formatBudget = (montant: number): string => {
    if (montant >= 1000000) {
      return `${(montant / 1000000).toFixed(1)}M XOF`;
    }
    if (montant >= 1000) {
      return `${(montant / 1000).toFixed(0)}K XOF`;
    }
    return `${montant} XOF`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filtrage des projets récents
  const projetsFiltres = projetsRecents.filter(projet =>
    projet.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    projet.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <h5 className="mb-0">Tableau de Bord</h5>
            <p className="mb-0 subtitle">Vue d'ensemble de vos projets et activités</p>
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
              <StyledBreadcrumb
                className="StyledBreadcrumb"
                label="Tableau de Bord"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Statistiques Principales */}
        <div>
          <div className="stats-grid">
            <div className="">
              <div className="dashboardBoxWrapper d-flex">
                <DashboardBoxProjet color={["#113385","#3DA2BA"]} icon={<MdWorkOutline />} grow={true} />
                <DashboardBoxAlerts color={["#3DA2BA","#113385"]} icon={<IoWarningOutline />} />
                <DashboardBoxBudget color={["#3DA2BA","#0E5D61"]} icon={<CiMoneyBill />} />
                <DashboardBoxUsers color={["#0E5D61","#3DA2BA"]} icon={<LuUsers />} />
              </div>
            </div>
          </div>
        </div>

        {/* Recherche et Actions Rapides */}
        <div className="bgColor2 card shadow border-0 p-4 mt-4">
          <div className="dashboard-actions">
            <div className="search-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher un projet..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="quick-actions">
              <button className="btn-action primary">
                <IoAddOutline />
                Nouveau Projet
              </button>
              <button className="btn-action secondary">
                <IoDownloadOutline />
                Exporter
              </button>
              <button className="btn-action secondary">
                <IoRefreshOutline />
                Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Projets Récents et Activités */}
        <div className="content-grid">
          {/* Projets Récents */}
          <div className="bgColor content-card">
            <div className="card-header">
              <h4 className="card-title">Projets Récents</h4>
              <button className="btn-view-all">
                Voir tout <IoEyeOutline />
              </button>
            </div>
            
            <div className="projets-list">
              {projetsFiltres.length > 0 ? (
                projetsFiltres.map(projet => (
                  <div key={projet.id} className="projet-item">
                    <div className="projet-info">
                      <div className="projet-main">
                        <h5 className="projet-name">{projet.nom}</h5>
                        <span className={`projet-status ${projet.statut}`}>
                          {projet.statut === 'en_cours' && <IoPlayCircleOutline />}
                          {projet.statut === 'termine' && <IoCheckmarkCircleOutline />}
                          {projet.statut === 'en_retard' && <IoAlertCircleOutline />}
                          {projet.statut === 'planifie' && <IoTimeOutline />}
                          {projet.statut.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="projet-meta">
                        <span className="projet-type">{projet.type}</span>
                        <span className="projet-budget">{formatBudget(projet.budget)}</span>
                      </div>
                      <div className="projet-dates">
                        <span>
                          <IoCalendarOutline />
                          {formatDate(projet.dateDebut)} - {formatDate(projet.dateFin)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="projet-progress">
                      <div className="progress-header">
                        <span className="progress-label">Progression</span>
                        <span className="progress-value">{projet.progression}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${projet.statut}`}
                          style={{ width: `${projet.progression}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>Aucun projet trouvé</p>
                </div>
              )}
            </div>
          </div>

          {/* Activités Récentes */}
          <div className="bgColor content-card">
            <div className="card-header">
              <h4 className="card-title">Activités Récentes</h4>
            </div>
            
            <div className="activities-list">
              <div className="activity-item">
                <div className="activity-icon success">
                  <IoCheckmarkCircleOutline />
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>Construction École Primaire</strong> a atteint 74% de progression
                  </p>
                  <span className="activity-time">Il y a 2 heures</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon warning">
                  <IoAlertCircleOutline />
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>Programme Nutrition Infantile</strong> est en retard de 15 jours
                  </p>
                  <span className="activity-time">Il y a 5 heures</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon info">
                  <IoPeopleOutline />
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    Nouveau prestataire <strong>Tech Solutions</strong> ajouté
                  </p>
                  <span className="activity-time">Il y a 1 jour</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon success">
                  <IoCheckmarkCircleOutline />
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>Centre de Santé Communautaire</strong> terminé avec succès
                  </p>
                  <span className="activity-time">Il y a 2 jours</span>
                </div>
              </div>

              <div className="activity-item">
                <div className="activity-icon primary">
                  <IoAddOutline />
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    Nouveau projet <strong>Énergie Solaire</strong> planifié
                  </p>
                  <span className="activity-time">Il y a 3 jours</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Indicateurs de Performance */}
        <div className="bgColor card shadow border-0 p-4 mt-4">
          <div className="performance-indicators">
            <h4 className="section-title">Indicateurs de Performance</h4>
            <div className="indicators-grid">
              <div className="indicator-item">
                <div className="indicator-value success">92%</div>
                <div className="indicator-label">Satisfaction Clients</div>
              </div>
              <div className="indicator-item">
                <div className="indicator-value warning">78%</div>
                <div className="indicator-label">Respect des Délais</div>
              </div>
              <div className="indicator-item">
                <div className="indicator-value info">85%</div>
                <div className="indicator-label">Utilisation Budget</div>
              </div>
              <div className="indicator-item">
                <div className="indicator-value primary">94%</div>
                <div className="indicator-label">Qualité des Livrables</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;