import React, { useState, useEffect } from 'react';
import './Dashboard.css';
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
  IoPlayCircleOutline,
  IoCarSportOutline,
  IoDocumentsOutline,
  IoSettingsOutline,
  IoAnalyticsOutline,
  IoArrowUpOutline,
  IoArrowDownOutline,
  IoTrendingUpOutline,
  IoWalletOutline,
  IoPieChartOutline,
  IoFilterOutline,
  IoNotificationsOutline,
  IoMenuOutline,
  IoShareSocialOutline
} from "react-icons/io5";
import { CiMoneyBill, CiStreamOn } from "react-icons/ci";
import { FaMotorcycle, FaChartLine, FaUsers, FaShieldAlt } from "react-icons/fa";
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
  rentabiliteGlobale: number;
  roiParBajaj: number;
  tauxExpansion: number;
  tresorerie: number;
  investissements: number;
  margesBeneficiaires: number;
  performanceVehicules: number;
  tauxUtilisation: number;
  validationsEnAttente: number;
  budgetsApprouves: number;
  bilanGlobal: number;
  acquisitionsPlanifiees: number;
}

interface RapportRecent {
  id: number;
  titre: string;
  type: 'mensuel' | 'strategique' | 'compte_rendu' | 'performance' | 'analytique';
  date: string;
  statut: 'termine' | 'en_cours' | 'en_retard' | 'nouveau';
  auteur: string;
  priorite: 'basse' | 'moyenne' | 'haute';
}

interface PerformanceMetric {
  label: string;
  value: number;
  trend: number;
  target: number;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    rentabiliteGlobale: 0,
    roiParBajaj: 0,
    tauxExpansion: 0,
    tresorerie: 0,
    investissements: 0,
    margesBeneficiaires: 0,
    performanceVehicules: 0,
    tauxUtilisation: 0,
    validationsEnAttente: 0,
    budgetsApprouves: 0,
    bilanGlobal: 0,
    acquisitionsPlanifiees: 0
  });

  const [rapportsRecents, setRapportsRecents] = useState<RapportRecent[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Données mock pour le dashboard transport
  useEffect(() => {
    const mockStats: DashboardStats = {
      rentabiliteGlobale: 24.5,
      roiParBajaj: 18.2,
      tauxExpansion: 12.8,
      tresorerie: 185000000,
      investissements: 45000000,
      margesBeneficiaires: 32.5,
      performanceVehicules: 87.3,
      tauxUtilisation: 76.4,
      validationsEnAttente: 8,
      budgetsApprouves: 12,
      bilanGlobal: 94.2,
      acquisitionsPlanifiees: 15
    };

    const mockRapports: RapportRecent[] = [
      {
        id: 1,
        titre: 'Analyse Performance Flotte Q1 2024',
        type: 'performance',
        date: '2024-03-15',
        statut: 'termine',
        auteur: 'Directeur Général',
        priorite: 'haute'
      },
      {
        id: 2,
        titre: 'Stratégie Expansion Régionale Nord',
        type: 'strategique',
        date: '2024-03-10',
        statut: 'en_cours',
        auteur: 'Comité Stratégique',
        priorite: 'haute'
      },
      {
        id: 3,
        titre: 'Rapport Acquisition Véhicules Mars',
        type: 'compte_rendu',
        date: '2024-03-08',
        statut: 'termine',
        auteur: 'Directeur Flotte',
        priorite: 'moyenne'
      },
      {
        id: 4,
        titre: 'Analyse Données Clients Premium',
        type: 'analytique',
        date: '2024-03-05',
        statut: 'nouveau',
        auteur: 'Data Analyst',
        priorite: 'haute'
      },
      {
        id: 5,
        titre: 'Plan Investissement 2024-2025',
        type: 'strategique',
        date: '2024-03-01',
        statut: 'en_cours',
        auteur: 'PDG',
        priorite: 'haute'
      }
    ];

    const mockMetrics: PerformanceMetric[] = [
      {
        label: "Satisfaction Client",
        value: 94,
        trend: 2.1,
        target: 95,
        icon: <FaUsers />
      },
      {
        label: "Efficacité Opérationnelle",
        value: 88,
        trend: 1.4,
        target: 90,
        icon: <CiStreamOn />
      },
      {
        label: "Disponibilité Flotte",
        value: 92,
        trend: 0.8,
        target: 95,
        icon: <FaMotorcycle />
      },
      {
        label: "Conformité Réglementaire",
        value: 96,
        trend: 1.2,
        target: 98,
        icon: <FaShieldAlt />
      }
    ];

    setStats(mockStats);
    setRapportsRecents(mockRapports);
    setPerformanceMetrics(mockMetrics);
    setLoading(false);
  }, []);

  const formatMontant = (montant: number): string => {
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

  // Filtrage des rapports récents
  const rapportsFiltres = rapportsRecents.filter(rapport =>
    (rapport.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rapport.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rapport.auteur.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (activeFilter === 'all' || rapport.statut === activeFilter)
  );

  // Composant de carte de statistique
  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary',
    trend,
    suffix = '',
    prefix = '',
    description = '',
    delay = 0
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent' | 'purple' | 'gradient';
    trend?: number;
    suffix?: string;
    prefix?: string;
    description?: string;
    delay?: number;
  }) => (
    <div 
      className={`stat-card ${color}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="stat-background"></div>
      <div className="stat-content-wrapper">
        <div className="stat-header">
          <div className="stat-icon-wrapper">
            {icon}
          </div>
          <div className="stat-trend-indicator">
            {trend !== undefined && (
              <span className={`trend ${trend >= 0 ? 'positive' : 'negative'}`}>
                {trend >= 0 ? <IoArrowUpOutline /> : <IoArrowDownOutline />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        </div>
        <div className="stat-content">
          <div className="stat-value">
            {prefix}{value}{suffix}
          </div>
          <div className="stat-title">{title}</div>
          {description && <div className="stat-description">{description}</div>}
        </div>
      </div>
    </div>
  );

  // Composant de métrique de performance
  const PerformanceMetricCard = ({ metric, delay }: { metric: PerformanceMetric; delay: number }) => (
    <div 
      className="performance-metric-card"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="metric-header">
        <div className="metric-icon">
          {metric.icon}
        </div>
        <div className="metric-stats">
          <span className="metric-value">{metric.value}%</span>
          <span className={`metric-trend ${metric.trend >= 0 ? 'positive' : 'negative'}`}>
            {metric.trend >= 0 ? '+' : ''}{metric.trend}%
          </span>
        </div>
      </div>
      <div className="metric-content">
        <h4 className="metric-label">{metric.label}</h4>
        <div className="metric-progress">
          <div 
            className="progress-bar"
            style={{ width: `${metric.value}%` }}
          ></div>
          <div className="progress-target">
            <span>Cible: {metric.target}%</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-modern">
      <div className="dashboard-content">
        <div className="header administration-header">
          <div className="header-content">
              <div className="header-text">
                <div className="header-title-content">
                    <h1 className="dashboard-title">
                    Tableau de Bord <span className="highlight">Stratégique</span>
                    </h1>
                    <p className="dashboard-subtitle">
                      Vue d'ensemble en temps réel des performances et indicateurs clés de votre entreprise
                    </p>
                </div>
              </div>
          </div>
          
          <div className="header-breadcrumbs">
              <Breadcrumbs aria-label="breadcrumb">
              <a href="/">
                  <StyledBreadcrumb
                  component="a"
                  label="Accueil"
                  icon={<HomeIcon fontSize="small" />}
                  />
              </a>
              <StyledBreadcrumb
                  label="Finances"
                  icon={<ExpandMoreIcon fontSize="small" />}
              />
              </Breadcrumbs>
          </div>
        </div>

        {/* Barre de recherche et actions rapides */}
        <div className="dashboard-controls">
          <div className="search-section">
            <div className="search-wrapper">
              <IoSearchOutline className="search-icon" />
              <input
                type="text"
                placeholder="Rechercher un rapport, une analyse..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="search-actions">
                <IoFilterOutline className="filter-icon" />
              </div>
            </div>
          </div>
          <div className="actions-section">
            <button className="action-btn primary">
              <IoAddOutline />
              <span>Nouveau Rapport</span>
            </button>
            <button className="action-btn secondary">
              <IoDownloadOutline />
              <span>Exporter</span>
            </button>
            <button className="action-btn secondary">
              <IoRefreshOutline />
              <span>Actualiser</span>
            </button>
          </div>
        </div>

        {/* Filtres rapides */}
        <div className="quick-filters">
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Tous les rapports
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'nouveau' ? 'active' : ''}`}
            onClick={() => setActiveFilter('nouveau')}
          >
            Nouveaux
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'en_cours' ? 'active' : ''}`}
            onClick={() => setActiveFilter('en_cours')}
          >
            En cours
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'termine' ? 'active' : ''}`}
            onClick={() => setActiveFilter('termine')}
          >
            Terminés
          </button>
        </div>

        {/* Section KPI Principaux */}
        <section className="dashboard-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <IoAnalyticsOutline className="section-icon" />
              <h2 className="section-title">Indicateurs Clés de Performance</h2>
            </div>
            <div className="section-actions">
              <button className="section-action-btn">
                <IoShareSocialOutline />
                Partager
              </button>
            </div>
          </div>
          
          {/* Grille 2x2 fixe */}
          <div className="stats-grid-2x2">
            <div className="grid-row">
              <div className="grid-col">
                <StatCard
                  title="Rentabilité Globale"
                  value={stats.rentabiliteGlobale}
                  suffix="%"
                  icon={<IoPieChartOutline />}
                  color="gradient"
                  trend={2.4}
                  description="Croissance trimestrielle"
                  delay={100}
                />
              </div>
              <div className="grid-col">
                <StatCard
                  title="ROI par Bajaj"
                  value={stats.roiParBajaj}
                  suffix="%"
                  icon={<CiMoneyBill />}
                  color="primary"
                  trend={1.2}
                  description="Retour sur investissement"
                  delay={200}
                />
              </div>
            </div>
            <div className="grid-row">
              <div className="grid-col">
                <StatCard
                  title="Taux d'Expansion"
                  value={stats.tauxExpansion}
                  suffix="%"
                  icon={<IoTrendingUpOutline />}
                  color="accent"
                  trend={3.1}
                  description="Nouvelles zones couvertes"
                  delay={300}
                />
              </div>
              <div className="grid-col">
                <StatCard
                  title="Trésorerie"
                  value={formatMontant(stats.tresorerie)}
                  icon={<IoWalletOutline />}
                  color="success"
                  description="Disponibilités actuelles"
                  delay={400}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contenu principal avec grille responsive */}
        <div className="main-content-grid">
          {/* 📈 Section Rapports Récents */}
          <div className="content-column main-column">
            <div className="content-card">
              <div className="card-header">
                <div className="card-title-section">
                  <IoDocumentsOutline className="card-icon" />
                  <div>
                    <h3 className="card-title">Rapports Récents</h3>
                    <p className="card-subtitle">{rapportsFiltres.length} rapports trouvés</p>
                  </div>
                </div>
                <button className="view-all-btn">
                  <span>Voir tout</span>
                  <IoEyeOutline />
                </button>
              </div>
              
              <div className="rapports-container">
                {rapportsFiltres.length > 0 ? (
                  rapportsFiltres.map((rapport, index) => (
                    <div 
                      key={rapport.id} 
                      className="rapport-card"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="rapport-priority-indicator" data-priority={rapport.priorite}></div>
                      <div className="rapport-content">
                        <div className="rapport-header">
                          <h4 className="rapport-title">{rapport.titre}</h4>
                          <span className={`rapport-status ${rapport.statut}`}>
                            {rapport.statut === 'termine' && <IoCheckmarkCircleOutline />}
                            {rapport.statut === 'en_cours' && <IoPlayCircleOutline />}
                            {rapport.statut === 'en_retard' && <IoAlertCircleOutline />}
                            {rapport.statut === 'nouveau' && <IoNotificationsOutline />}
                            {rapport.statut.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="rapport-meta">
                          <span className={`rapport-type ${rapport.type}`}>
                            {rapport.type === 'mensuel' && '📊 Mensuel PDG'}
                            {rapport.type === 'strategique' && '🎯 Stratégique'}
                            {rapport.type === 'compte_rendu' && '📋 Compte Rendu'}
                            {rapport.type === 'performance' && '📈 Performance'}
                            {rapport.type === 'analytique' && '🔍 Analytique'}
                          </span>
                          <span className="rapport-author">Par {rapport.auteur}</span>
                        </div>
                        <div className="rapport-footer">
                          <div className="rapport-date">
                            <IoCalendarOutline />
                            {formatDate(rapport.date)}
                          </div>
                          <span className="rapport-priority" data-priority={rapport.priorite}>
                            {rapport.priorite}
                          </span>
                        </div>
                      </div>
                      <div className="rapport-actions">
                        <button className="icon-btn primary" title="Voir">
                          <IoEyeOutline />
                        </button>
                        <button className="icon-btn secondary" title="Télécharger">
                          <IoDownloadOutline />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <IoDocumentsOutline className="no-results-icon" />
                    <p>Aucun rapport trouvé pour votre recherche</p>
                    <button className="action-btn primary">
                      <IoAddOutline />
                      Créer un nouveau rapport
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 📊 Section Métriques de Performance */}
          <div className="content-column sidebar-column">
            <div className="content-card">
              <div className="card-header">
                <div className="card-title-section">
                  <FaChartLine className="card-icon" />
                  <div>
                    <h3 className="card-title">Performance</h3>
                    <p className="card-subtitle">Indicateurs en temps réel</p>
                  </div>
                </div>
              </div>
              
              <div className="performance-metrics">
                {performanceMetrics.map((metric, index) => (
                  <PerformanceMetricCard 
                    key={index} 
                    metric={metric} 
                    delay={index * 150}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ⚙️ Section Actions Rapides */}
        <div className="mb-5 content-card">
          <div className="card-header">
            <div className="card-title-section">
              <IoSettingsOutline className="card-icon" />
              <div>
                <h3 className="card-title">Actions Rapides</h3>
                <p className="card-subtitle">Tâches prioritaires</p>
              </div>
            </div>
          </div>
          
          <div className="quick-actions">
            <div className="quick-action-item">
              <div className="action-icon warning">
                <IoDocumentsOutline />
              </div>
              <div className="action-content">
                <p className="action-title">{stats.validationsEnAttente} validations en attente</p>
                <p className="action-subtitle">Documents à approuver</p>
              </div>
              <button className="action-button">
                Vérifier
              </button>
            </div>

            <div className="quick-action-item">
              <div className="action-icon success">
                <IoCheckmarkCircleOutline />
              </div>
              <div className="action-content">
                <p className="action-title">{stats.budgetsApprouves} budgets approuvés</p>
                <p className="action-subtitle">Ce mois-ci</p>
              </div>
              <button className="action-button outline">
                Détails
              </button>
            </div>

            <div className="quick-action-item">
              <div className="action-icon info">
                <IoPeopleOutline />
              </div>
              <div className="action-content">
                <p className="action-title">Réunion stratégique</p>
                <p className="action-subtitle">Dans 2 jours</p>
              </div>
              <button className="action-button">
                Planifier
              </button>
            </div>
          </div>
        </div>

        {/* 🚗 Section Performance Flotte */}
        <section className="dashboard-section">
          <div className="section-header">
            <div className="section-title-wrapper">
              <IoCarSportOutline className="section-icon" />
              <h2 className="section-title">Performance Flotte</h2>
            </div>
          </div>
          
          <div className="stats-grid-secondary">
            <StatCard
              title="Performance Véhicules"
              value={stats.performanceVehicules}
              suffix="%"
              icon={<FaMotorcycle />}
              color="primary"
              trend={2.3}
              description="Efficacité opérationnelle"
              delay={100}
            />
            <StatCard
              title="Taux d'Utilisation"
              value={stats.tauxUtilisation}
              suffix="%"
              icon={<IoTimeOutline />}
              color="info"
              trend={1.1}
              description="Optimisation des ressources"
              delay={200}
            />
            <StatCard
              title="Acquisitions Planifiées"
              value={stats.acquisitionsPlanifiees}
              icon={<IoAddOutline />}
              color="accent"
              description="Nouveaux véhicules"
              delay={300}
            />
            <StatCard
              title="Maintenance"
              value="92%"
              icon={<IoSettingsOutline />}
              color="success"
              trend={0.5}
              description="Taux de disponibilité"
              delay={400}
            />
          </div>
        </section>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;