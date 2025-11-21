import React, { useState, useEffect } from 'react';
import './ListeFlotte.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoCarSportOutline,
  IoCalendarOutline,
  IoLocationOutline,
  IoPeopleOutline,
  IoTimeOutline,
  IoEyeOutline,
  IoSettingsOutline,
  IoAddOutline,
  IoCheckmarkCircleOutline,
  IoAlertCircleOutline,
  IoPlayCircleOutline,
  IoMenuOutline,
  IoAnalyticsOutline,
  IoTrendingUpOutline,
  IoHardwareChipOutline
} from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
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
interface Vehicule {
  id: number;
  matricule: string;
  modele: string;
  type: 'tuc_tuc_electrique' | 'tuc_tuc_thermique' | 'utilitaire' | 'autre';
  date_acquisition: string;
  kilometrage: number;
  etat: 'excellent' | 'bon' | 'maintenance' | 'hors_service';
  performance: number;
  taux_utilisation: number;
  revenu_journalier: number;
  cout_maintenance: number;
  chauffeur: string;
  localisation: string;
  dernier_entretien: string;
  prochain_entretien: string;
  statut: 'actif' | 'inactif' | 'en_maintenance' | 'reserve';
}

interface AcquisitionPlanifiee {
  id: number;
  type_vehicule: string;
  quantite: number;
  budget_estime: number;
  date_livraison_prevue: string;
  statut: 'planifie' | 'en_cours' | 'termine' | 'retarde';
  priorite: 'basse' | 'moyenne' | 'haute' | 'critique';
  fournisseur: string;
  delai_restant: number;
}

interface PerformanceFlotte {
  performance_moyenne: number;
  taux_utilisation_moyen: number;
  vehicules_actifs: number;
  vehicules_maintenance: number;
  revenu_mensuel: number;
  cout_maintenance_mensuel: number;
  rentabilite_moyenne: number;
  kilometrage_total: number;
}

const ListeFlotte: React.FC = () => {
  const [sectionActive, setSectionActive] = useState<'performance' | 'acquisitions' | 'utilisation'>('performance');
  const [vehicules, setVehicules] = useState<Vehicule[]>([]);
  const [acquisitions, setAcquisitions] = useState<AcquisitionPlanifiee[]>([]);
  const [performanceFlotte, setPerformanceFlotte] = useState<PerformanceFlotte>({
    performance_moyenne: 0,
    taux_utilisation_moyen: 0,
    vehicules_actifs: 0,
    vehicules_maintenance: 0,
    revenu_mensuel: 0,
    cout_maintenance_mensuel: 0,
    rentabilite_moyenne: 0,
    kilometrage_total: 0
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [filtres, setFiltres] = useState({
    recherche: '',
    type_vehicule: 'all',
    statut: 'all',
    etat: 'all'
  });

  // Données mock basées sur votre business plan
  useEffect(() => {
    const mockVehicules: Vehicule[] = [
      {
        id: 1,
        matricule: "TUC-001-ET",
        modele: "Tuc Tuc Électrique Robust",
        type: 'tuc_tuc_electrique',
        date_acquisition: '2024-01-15',
        kilometrage: 12500,
        etat: 'excellent',
        performance: 94,
        taux_utilisation: 87,
        revenu_journalier: 66000,
        cout_maintenance: 150000,
        chauffeur: "Jean Rakoto",
        localisation: "Tamatave Centre",
        dernier_entretien: '2024-03-01',
        prochain_entretien: '2024-04-15',
        statut: 'actif'
      },
      {
        id: 2,
        matricule: "TUC-002-ET",
        modele: "Tuc Tuc Électrique Standard",
        type: 'tuc_tuc_electrique',
        date_acquisition: '2024-02-01',
        kilometrage: 8900,
        etat: 'bon',
        performance: 88,
        taux_utilisation: 76,
        revenu_journalier: 58000,
        cout_maintenance: 120000,
        chauffeur: "Marie Randria",
        localisation: "Tamatave Nord",
        dernier_entretien: '2024-03-10',
        prochain_entretien: '2024-04-20',
        statut: 'actif'
      },
      {
        id: 3,
        matricule: "TUC-003-ET",
        modele: "Tuc Tuc Électrique Robust",
        type: 'tuc_tuc_electrique',
        date_acquisition: '2024-01-20',
        kilometrage: 15200,
        etat: 'maintenance',
        performance: 72,
        taux_utilisation: 45,
        revenu_journalier: 32000,
        cout_maintenance: 250000,
        chauffeur: "Pierre Andria",
        localisation: "Tamatave Garage",
        dernier_entretien: '2024-03-15',
        prochain_entretien: '2024-03-30',
        statut: 'en_maintenance'
      },
      {
        id: 4,
        matricule: "TUC-004-ET",
        modele: "Tuc Tuc Électrique Standard",
        type: 'tuc_tuc_electrique',
        date_acquisition: '2024-03-01',
        kilometrage: 3200,
        etat: 'excellent',
        performance: 96,
        taux_utilisation: 92,
        revenu_journalier: 71000,
        cout_maintenance: 80000,
        chauffeur: "Sophie Ranaivo",
        localisation: "Tamatave Sud",
        dernier_entretien: '2024-03-20',
        prochain_entretien: '2024-05-01',
        statut: 'actif'
      },
      {
        id: 5,
        matricule: "TUC-005-ET",
        modele: "Tuc Tuc Électrique Robust",
        type: 'tuc_tuc_electrique',
        date_acquisition: '2024-02-15',
        kilometrage: 6800,
        etat: 'bon',
        performance: 85,
        taux_utilisation: 78,
        revenu_journalier: 62000,
        cout_maintenance: 110000,
        chauffeur: "Luc Andriana",
        localisation: "Tamatave Ouest",
        dernier_entretien: '2024-03-05',
        prochain_entretien: '2024-04-25',
        statut: 'actif'
      }
    ];

    const mockAcquisitions: AcquisitionPlanifiee[] = [
      {
        id: 1,
        type_vehicule: "Tuc Tuc Électrique Robust",
        quantite: 2,
        budget_estime: 34000000,
        date_livraison_prevue: '2024-04-30',
        statut: 'planifie',
        priorite: 'haute',
        fournisseur: "ElectroMobility Ltd",
        delai_restant: 45
      },
      {
        id: 2,
        type_vehicule: "Tuc Tuc Électrique Standard",
        quantite: 3,
        budget_estime: 48000000,
        date_livraison_prevue: '2024-05-15',
        statut: 'en_cours',
        priorite: 'moyenne',
        fournisseur: "GreenTech Solutions",
        delai_restant: 60
      },
      {
        id: 3,
        type_vehicule: "Station de Chargement",
        quantite: 1,
        budget_estime: 15000000,
        date_livraison_prevue: '2024-04-15',
        statut: 'termine',
        priorite: 'critique',
        fournisseur: "PowerCharge Inc",
        delai_restant: 0
      }
    ];

    const mockPerformance: PerformanceFlotte = {
      performance_moyenne: 87,
      taux_utilisation_moyen: 76,
      vehicules_actifs: 4,
      vehicules_maintenance: 1,
      revenu_mensuel: 18920000,
      cout_maintenance_mensuel: 710000,
      rentabilite_moyenne: 25.6,
      kilometrage_total: 46600
    };

    setVehicules(mockVehicules);
    setAcquisitions(mockAcquisitions);
    setPerformanceFlotte(mockPerformance);
    setLoading(false);
  }, []);

  // Gestion des changements de filtres
  const handleFiltreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFiltres(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Formatage du budget
  const formatBudget = (montant: number): string => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'MGA',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(montant);
  };

  // Obtenir l'icône selon le type
  const getIconeParType = (type: string) => {
    switch (type) {
      case 'tuc_tuc_electrique': return <IoCarSportOutline />;
      case 'tuc_tuc_thermique': return <IoCarSportOutline />;
      case 'utilitaire': return <IoHardwareChipOutline />;
      default: return <IoCarSportOutline />;
    }
  };

  // Obtenir la couleur selon le statut
  const getCouleurStatut = (statut: string) => {
    switch (statut) {
      case 'actif': return '#10b981';
      case 'inactif': return '#6b7280';
      case 'en_maintenance': return '#f59e0b';
      case 'reserve': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  // Obtenir la couleur selon l'état
  const getCouleurEtat = (etat: string) => {
    switch (etat) {
      case 'excellent': return '#10b981';
      case 'bon': return '#3b82f6';
      case 'maintenance': return '#f59e0b';
      case 'hors_service': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Filtrer les véhicules
  const vehiculesFiltres = vehicules.filter(vehicule => {
    const matchesType = filtres.type_vehicule === 'all' || vehicule.type === filtres.type_vehicule;
    const matchesStatut = filtres.statut === 'all' || vehicule.statut === filtres.statut;
    const matchesEtat = filtres.etat === 'all' || vehicule.etat === filtres.etat;
    const matchesRecherche = 
      vehicule.matricule.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      vehicule.modele.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      vehicule.chauffeur.toLowerCase().includes(filtres.recherche.toLowerCase());

    return matchesType && matchesStatut && matchesEtat && matchesRecherche;
  });

  // Composant de carte de statistique
  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color = 'primary',
    suffix = '',
    description = '',
    delay = 0
  }: {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'accent';
    suffix?: string;
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
        </div>
        <div className="stat-content">
          <div className="stat-value">
            {value}{suffix}
          </div>
          <div className="stat-title">{title}</div>
          {description && <div className="stat-description">{description}</div>}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flotte-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des données de la flotte...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flotte-container">
      <div className="right-content w-100">
        {/* Header avec Breadcrumbs */}
        <div className="flotte-header">
          <div className="header-content">
            <div className="header-text">
              <div className="header-title-content">
                <h1 className="dashboard-title">
                  Gestion de <span className="highlight">Flotte</span>
                </h1>
                <p className="dashboard-subtitle">
                  Optimisation et suivi complet de votre parc de véhicules
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
                label="Flotte"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Navigation des Sections */}
        <div className="navigation-sections">
          <button 
            className={`nav-btn ${sectionActive === 'performance' ? 'active' : ''}`}
            onClick={() => setSectionActive('performance')}
          >
            <IoAnalyticsOutline />
            Performance par Véhicule
          </button>
          <button 
            className={`nav-btn ${sectionActive === 'acquisitions' ? 'active' : ''}`}
            onClick={() => setSectionActive('acquisitions')}
          >
            <IoAddOutline />
            Acquisitions Planifiées
          </button>
          <button 
            className={`nav-btn ${sectionActive === 'utilisation' ? 'active' : ''}`}
            onClick={() => setSectionActive('utilisation')}
          >
            <IoTrendingUpOutline />
            Taux d'Utilisation
          </button>
        </div>

        {/* Section Performance par Véhicule */}
        {sectionActive === 'performance' && (
          <div className="section-content">
            <div className="section-header">
              <h3>📊 Performance par Véhicule</h3>
              <p>Analyse détaillée des performances individuelles de chaque véhicule</p>
            </div>

            {/* Statistiques Globales */}
            <div className="stats-grid-global">
              <div className="stat-card primary">
                <div className="stat-content-wrapper">
                  <div className="stat-content">
                    <div className="stat-value">
                      {performanceFlotte.performance_moyenne}%
                    </div>
                    <div className="stat-title">Performance Moyenne</div>
                    <div className="stat-description">Score moyen de la flotte</div>
                  </div>
                </div>
              </div>
              
              <div className="stat-card success">
                <div className="stat-content-wrapper">
                  <div className="stat-content">
                    <div className="stat-value">
                      {performanceFlotte.taux_utilisation_moyen}%
                    </div>
                    <div className="stat-title">Taux d'Utilisation</div>
                    <div className="stat-description">Utilisation moyenne</div>
                  </div>
                </div>
              </div>
              
              <div className="stat-card info">
                <div className="stat-content-wrapper">
                  <div className="stat-content">
                    <div className="stat-value">
                      {performanceFlotte.vehicules_actifs}/5
                    </div>
                    <div className="stat-title">Véhicules Actifs</div>
                    <div className="stat-description">En service</div>
                  </div>
                </div>
              </div>
              
              <div className="stat-card accent">
                <div className="stat-content-wrapper">
                  <div className="stat-content">
                    <div className="stat-value">
                      {performanceFlotte.rentabilite_moyenne}%
                    </div>
                    <div className="stat-title">Rentabilité Moyenne</div>
                    <div className="stat-description">Retour sur investissement</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtres */}
            <div className="filtres-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  name="recherche"
                  placeholder="Rechercher un véhicule..."
                  className="search-input"
                  value={filtres.recherche}
                  onChange={handleFiltreChange}
                />
              </div>
              
              <div className="filter-group">
                <select 
                  name="type_vehicule"
                  value={filtres.type_vehicule}
                  onChange={handleFiltreChange}
                >
                  <option value="all">Tous les types</option>
                  <option value="tuc_tuc_electrique">Tuc Tuc Électrique</option>
                  <option value="tuc_tuc_thermique">Tuc Tuc Thermique</option>
                  <option value="utilitaire">Utilitaire</option>
                </select>
              </div>

              <div className="filter-group">
                <select 
                  name="statut"
                  value={filtres.statut}
                  onChange={handleFiltreChange}
                >
                  <option value="all">Tous les statuts</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                  <option value="en_maintenance">Maintenance</option>
                </select>
              </div>

              <div className="action-buttons">
                <button className="btn-action secondary">
                  <IoDownloadOutline />
                  Exporter
                </button>
                <button className="btn-action secondary">
                  <IoPrintOutline />
                  Imprimer
                </button>
              </div>
            </div>

            {/* Liste des Véhicules */}
            <div className="vehicules-grid">
              {vehiculesFiltres.map((vehicule) => (
                <div key={vehicule.id} className={`vehicule-card ${vehicule.statut}`}>
                  <div className="vehicule-header">
                    <div className="vehicule-icon">
                      {getIconeParType(vehicule.type)}
                    </div>
                    <div className="vehicule-info">
                      <h4>{vehicule.modele}</h4>
                      <div className="vehicule-meta">
                        <span className="matricule">{vehicule.matricule}</span>
                        <span className={`statut ${vehicule.statut}`} style={{ backgroundColor: getCouleurStatut(vehicule.statut) }}>
                          {vehicule.statut === 'actif' && '🟢 Actif'}
                          {vehicule.statut === 'inactif' && '⚪ Inactif'}
                          {vehicule.statut === 'en_maintenance' && '🟡 Maintenance'}
                          {vehicule.statut === 'reserve' && '🔵 Réservé'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="vehicule-body">
                    <div className="vehicule-stats">
                      <div className="stat-row">
                        <div className="stat">
                          <span className="label">Performance</span>
                          <span className="valeur">
                            <div className="performance-bar">
                              <div 
                                className="performance-fill"
                                style={{ width: `${vehicule.performance}%` }}
                              ></div>
                            </div>
                            {vehicule.performance}%
                          </span>
                        </div>
                        <div className="stat">
                          <span className="label">Utilisation</span>
                          <span className="valeur">{vehicule.taux_utilisation}%</span>
                        </div>
                      </div>
                      
                      <div className="stat-row">
                        <div className="stat">
                          <span className="label">Kilométrage</span>
                          <span className="valeur">{vehicule.kilometrage.toLocaleString()} km</span>
                        </div>
                        <div className="stat">
                          <span className="label">Revenu/jour</span>
                          <span className="valeur">{formatBudget(vehicule.revenu_journalier)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="vehicule-details">
                      <div className="detail-item">
                        <IoPeopleOutline />
                        <span>{vehicule.chauffeur}</span>
                      </div>
                      <div className="detail-item">
                        <IoLocationOutline />
                        <span>{vehicule.localisation}</span>
                      </div>
                      <div className="detail-item">
                        <IoCalendarOutline />
                        <span>Prochain entretien: {new Date(vehicule.prochain_entretien).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>

                    <div className={`etat-indicator ${vehicule.etat}`} style={{ borderColor: getCouleurEtat(vehicule.etat) }}>
                      État: {vehicule.etat}
                    </div>
                  </div>

                  <div className="mt-3 vehicule-actions">
                    <button className="icon-btn primary" title="Voir détails">
                      <IoEyeOutline />
                    </button>
                    <button className="icon-btn secondary" title="Maintenance">
                      <IoSettingsOutline />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Acquisitions Planifiées */}
        {sectionActive === 'acquisitions' && (
          <div className="section-content">
            <div className="section-header">
              <h3>🏗️ Acquisitions Planifiées</h3>
              <p>Planification et suivi des nouvelles acquisitions de véhicules</p>
            </div>

            {/* Résumé des Acquisitions */}
            <div className="acquisitions-summary">
              <div className="summary-card">
                <h4>Budget Total Alloué</h4>
                <div className="summary-value">{formatBudget(acquisitions.reduce((sum, acc) => sum + acc.budget_estime, 0))}</div>
                <div className="summary-label">{acquisitions.length} acquisitions planifiées</div>
              </div>
              <div className="summary-card">
                <h4>Prochaines Livraisons</h4>
                <div className="summary-value">{acquisitions.filter(acc => acc.statut === 'planifie' || acc.statut === 'en_cours').length}</div>
                <div className="summary-label">En attente</div>
              </div>
              <div className="summary-card">
                <h4>Acquisitions Terminées</h4>
                <div className="summary-value">{acquisitions.filter(acc => acc.statut === 'termine').length}</div>
                <div className="summary-label">Cette année</div>
              </div>
            </div>

            {/* Liste des Acquisitions */}
            <div className="acquisitions-grid">
              {acquisitions.map((acquisition) => (
                <div key={acquisition.id} className={`acquisition-card ${acquisition.statut}`}>
                  <div className="acquisition-header">
                    <div className="acquisition-icon">
                      {acquisition.statut === 'planifie' && <IoTimeOutline />}
                      {acquisition.statut === 'en_cours' && <IoPlayCircleOutline />}
                      {acquisition.statut === 'termine' && <IoCheckmarkCircleOutline />}
                      {acquisition.statut === 'retarde' && <IoAlertCircleOutline />}
                    </div>
                    <div className="acquisition-info">
                      <h4>{acquisition.type_vehicule}</h4>
                      <div className="acquisition-meta">
                        <span className="quantite">Quantité: {acquisition.quantite}</span>
                        <span className={`priorite ${acquisition.priorite}`}>
                          {acquisition.priorite}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="acquisition-body">
                    <div className="acquisition-details">
                      <div className="detail">
                        <span className="label">Budget:</span>
                        <span className="valeur">{formatBudget(acquisition.budget_estime)}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Fournisseur:</span>
                        <span className="valeur">{acquisition.fournisseur}</span>
                      </div>
                      <div className="detail">
                        <span className="label">Livraison prévue:</span>
                        <span className="valeur">{new Date(acquisition.date_livraison_prevue).toLocaleDateString('fr-FR')}</span>
                      </div>
                      {acquisition.delai_restant > 0 && (
                        <div className="detail">
                          <span className="label">Délai restant:</span>
                          <span className="valeur">{acquisition.delai_restant} jours</span>
                        </div>
                      )}
                    </div>

                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Avancement</span>
                        <span>
                          {acquisition.statut === 'planifie' && '25%'}
                          {acquisition.statut === 'en_cours' && '60%'}
                          {acquisition.statut === 'termine' && '100%'}
                          {acquisition.statut === 'retarde' && '40%'}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ 
                            width: acquisition.statut === 'planifie' ? '25%' : 
                                   acquisition.statut === 'en_cours' ? '60%' :
                                   acquisition.statut === 'termine' ? '100%' : '40%'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 acquisition-actions">
                    <button className="btn-action primary">
                      Suivre
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Taux d'Utilisation */}
        {sectionActive === 'utilisation' && (
          <div className="section-content">
            <div className="section-header">
              <h3>📈 Taux d'Utilisation</h3>
              <p>Analyse de l'optimisation et de l'utilisation de votre flotte</p>
            </div>

            {/* Métriques d'Utilisation */}
            <div className="utilisation-metrics">
              <div className="metric-card">
                <div className="metric-header">
                  <IoTrendingUpOutline />
                  <h4>Utilisation Globale</h4>
                </div>
                <div className="metric-value">{performanceFlotte.taux_utilisation_moyen}%</div>
                <div className="metric-progress">
                  <div 
                    className="progress-fill global"
                    style={{ width: `${performanceFlotte.taux_utilisation_moyen}%` }}
                  ></div>
                </div>
                <div className="metric-label">Moyenne de la flotte</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <IoCarSportOutline />
                  <h4>Véhicules Sous-utilisés</h4>
                </div>
                <div className="metric-value">
                  {vehicules.filter(v => v.taux_utilisation < 60).length}
                </div>
                <div className="metric-label">Taux &lt; 60%</div>
              </div>

              <div className="metric-card">
                <div className="metric-header">
                  <IoAnalyticsOutline />
                  <h4>Optimisation Revenus</h4>
                </div>
                <div className="metric-value">{formatBudget(performanceFlotte.revenu_mensuel)}</div>
                <div className="metric-label">Revenu mensuel</div>
              </div>
            </div>

            {/* Analyse Détaillée par Véhicule */}
            <div className="utilisation-analysis">
              <h4>Analyse par Véhicule</h4>
              <div className="analysis-grid">
                {vehicules.map((vehicule) => (
                  <div key={vehicule.id} className="analysis-card">
                    <div className="analysis-header">
                      <h5>{vehicule.matricule}</h5>
                      <span className="utilisation-rate">{vehicule.taux_utilisation}%</span>
                    </div>
                    <div className="analysis-progress">
                      <div 
                        className="progress-fill"
                        style={{ width: `${vehicule.taux_utilisation}%` }}
                      ></div>
                    </div>
                    <div className="analysis-details">
                      <div className="detail">
                        <span>Revenu/jour:</span>
                        <span>{formatBudget(vehicule.revenu_journalier)}</span>
                      </div>
                      <div className="detail">
                        <span>Performance:</span>
                        <span>{vehicule.performance}%</span>
                      </div>
                      <div className="detail">
                        <span>Statut:</span>
                        <span className={`statut ${vehicule.statut}`}>{vehicule.statut}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommandations d'Optimisation */}
            <div className="optimization-recommendations">
              <h4>🔧 Recommandations d'Optimisation</h4>
              <div className="recommendations-list">
                {vehicules.filter(v => v.taux_utilisation < 70).map((vehicule) => (
                  <div key={vehicule.id} className="recommendation-item">
                    <IoAlertCircleOutline className="warning-icon" />
                    <div className="recommendation-content">
                      <p><strong>{vehicule.matricule}</strong> - Taux d'utilisation faible ({vehicule.taux_utilisation}%)</p>
                      <small>Recommandation: Réaffecter vers des zones à forte demande</small>
                    </div>
                  </div>
                ))}
                {vehicules.filter(v => v.etat === 'maintenance').map((vehicule) => (
                  <div key={vehicule.id} className="recommendation-item">
                    <IoSettingsOutline className="maintenance-icon" />
                    <div className="recommendation-content">
                      <p><strong>{vehicule.matricule}</strong> - En maintenance depuis le {new Date(vehicule.dernier_entretien).toLocaleDateString('fr-FR')}</p>
                      <small>Recommandation: Accélérer les réparations</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ListeFlotte;