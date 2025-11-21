import React, { useState, useEffect } from 'react';
import './ListeFinances.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoDownloadOutline,
  IoPrintOutline,
  IoStatsChartOutline,
  IoCalendarOutline,
  IoWalletOutline,
  IoPieChartOutline,
  IoMenuOutline,
  IoAnalyticsOutline,
  IoBusinessOutline
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
interface FinanceData {
  id: number;
  type: 'bilan' | 'tresorerie' | 'investissement' | 'marge';
  titre: string;
  description: string;
  montant: number;
  variation: number;
  tendance: 'positive' | 'negative' | 'stable';
  date_mise_a_jour: string;
  details: {
    label: string;
    valeur: number;
    pourcentage?: number;
  }[];
  statut: 'excellent' | 'bon' | 'attention' | 'critique';
}

interface Investissement {
  id: number;
  nom: string;
  type: 'tuc_tuc' | 'infrastructure' | 'equipement' | 'formation';
  montant_investi: number;
  retour_attendu: number;
  retour_reel: number;
  duree: number;
  date_debut: string;
  statut: 'actif' | 'termine' | 'en_attente' | 'suspendu';
  rentabilite: number;
}

const ListeFinances: React.FC = () => {
  const [sectionActive, setSectionActive] = useState<'bilan' | 'tresorerie' | 'investissements' | 'marges'>('bilan');
  const [donneesFinances, setDonneesFinances] = useState<FinanceData[]>([]);
  const [investissements, setInvestissements] = useState<Investissement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filtres, setFiltres] = useState({
    recherche: '',
    periode: 'mois',
    type_investissement: 'all'
  });

  // Données mock basées sur votre business plan
  useEffect(() => {
    const mockDonneesFinances: FinanceData[] = [
      {
        id: 1,
        type: 'bilan',
        titre: 'Bilan Global Financier',
        description: 'Situation financière complète de l\'entreprise',
        montant: 126500000,
        variation: 12.5,
        tendance: 'positive',
        date_mise_a_jour: '2024-01-15',
        statut: 'excellent',
        details: [
          { label: 'Actifs Circulants', valeur: 89450000, pourcentage: 70.7 },
          { label: 'Actifs Immobilisés', valeur: 37050000, pourcentage: 29.3 },
          { label: 'Passifs Courants', valeur: 45200000, pourcentage: 35.7 },
          { label: 'Capitaux Propres', valeur: 81300000, pourcentage: 64.3 }
        ]
      },
      {
        id: 2,
        type: 'tresorerie',
        titre: 'Trésorerie Disponible',
        description: 'Liquidités immédiatement disponibles',
        montant: 45200000,
        variation: 8.2,
        tendance: 'positive',
        date_mise_a_jour: '2024-01-15',
        statut: 'bon',
        details: [
          { label: 'Comptes Bancaires', valeur: 38200000, pourcentage: 84.5 },
          { label: 'Caisse Opérationnelle', valeur: 5000000, pourcentage: 11.1 },
          { label: 'Placements Court Terme', valeur: 2000000, pourcentage: 4.4 }
        ]
      },
      {
        id: 3,
        type: 'investissement',
        titre: 'Investissements Totaux',
        description: 'Total des investissements réalisés',
        montant: 110000000,
        variation: 25.0,
        tendance: 'positive',
        date_mise_a_jour: '2024-01-15',
        statut: 'excellent',
        details: [
          { label: 'Flotte Tuc Tuc', valeur: 85000000, pourcentage: 77.3 },
          { label: 'Infrastructure', valeur: 15000000, pourcentage: 13.6 },
          { label: 'Équipements', valeur: 8000000, pourcentage: 7.3 },
          { label: 'Formation', valeur: 2000000, pourcentage: 1.8 }
        ]
      },
      {
        id: 4,
        type: 'marge',
        titre: 'Marge Bénéficiaire Nette',
        description: 'Marge après toutes les charges et impôts',
        montant: 28420000,
        variation: 15.3,
        tendance: 'positive',
        date_mise_a_jour: '2024-01-15',
        statut: 'excellent',
        details: [
          { label: 'Chiffre d\'Affaires', valeur: 126500000, pourcentage: 100 },
          { label: 'Charges d\'Exploitation', valeur: 76200000, pourcentage: 60.2 },
          { label: 'Charges Financières', valeur: 16500000, pourcentage: 13.0 },
          { label: 'Résultat Net', valeur: 28420000, pourcentage: 22.5 }
        ]
      }
    ];

    const mockInvestissements: Investissement[] = [
      {
        id: 1,
        nom: 'Tuc Tuc Électrique #001',
        type: 'tuc_tuc',
        montant_investi: 17000000,
        retour_attendu: 22992000,
        retour_reel: 21500000,
        duree: 36,
        date_debut: '2024-01-01',
        statut: 'actif',
        rentabilite: 26.5
      },
      {
        id: 2,
        nom: 'Station de Chargement',
        type: 'infrastructure',
        montant_investi: 15000000,
        retour_attendu: 25000000,
        retour_reel: 18000000,
        duree: 60,
        date_debut: '2024-02-01',
        statut: 'actif',
        rentabilite: 20.0
      },
      {
        id: 3,
        nom: 'Formation Chauffeurs',
        type: 'formation',
        montant_investi: 5000000,
        retour_attendu: 10000000,
        retour_reel: 8500000,
        duree: 24,
        date_debut: '2024-01-15',
        statut: 'actif',
        rentabilite: 70.0
      },
      {
        id: 4,
        nom: 'Tuc Tuc Électrique #002',
        type: 'tuc_tuc',
        montant_investi: 17000000,
        retour_attendu: 22992000,
        retour_reel: 12000000,
        duree: 36,
        date_debut: '2024-03-01',
        statut: 'en_attente',
        rentabilite: 0.0
      }
    ];

    setDonneesFinances(mockDonneesFinances);
    setInvestissements(mockInvestissements);
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
      case 'bilan': return <IoAnalyticsOutline />;
      case 'tresorerie': return <IoWalletOutline />;
      case 'investissement': return <IoBusinessOutline />;
      case 'marge': return <IoPieChartOutline />;
      default: return <IoStatsChartOutline />;
    }
  };

  // Obtenir la couleur selon le statut
  const getCouleurStatut = (statut: string) => {
    switch (statut) {
      case 'excellent': return '#10b981';
      case 'bon': return '#3b82f6';
      case 'attention': return '#f59e0b';
      case 'critique': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // Filtrer les investissements
  const investissementsFiltres = investissements.filter(invest => {
    const matchesType = filtres.type_investissement === 'all' || invest.type === filtres.type_investissement;
    const matchesRecherche = invest.nom.toLowerCase().includes(filtres.recherche.toLowerCase());
    return matchesType && matchesRecherche;
  });

  if (loading) {
    return (
      <div className="finances-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des données financières...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="finances-container">
      <div className="right-content w-100">
        {/* Header avec Breadcrumbs */}
        <div className="finances-header">
          <div className="header-content">
            <div className="header-text">
              <div className="header-title-content">
                <h1 className="dashboard-title">
                  Aperçu <span className="highlight">Financier</span>
                </h1>
                <p className="dashboard-subtitle">
                  Gestion et analyse complète des finances de votre entreprise
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

        {/* Navigation des Sections */}
        <div className="navigation-sections">
          <button 
            className={`nav-btn ${sectionActive === 'bilan' ? 'active' : ''}`}
            onClick={() => setSectionActive('bilan')}
          >
            <IoAnalyticsOutline />
            Bilan Global
          </button>
          <button 
            className={`nav-btn ${sectionActive === 'tresorerie' ? 'active' : ''}`}
            onClick={() => setSectionActive('tresorerie')}
          >
            <IoWalletOutline />
            Trésorerie
          </button>
          <button 
            className={`nav-btn ${sectionActive === 'investissements' ? 'active' : ''}`}
            onClick={() => setSectionActive('investissements')}
          >
            <IoBusinessOutline />
            Investissements
          </button>
          <button 
            className={`nav-btn ${sectionActive === 'marges' ? 'active' : ''}`}
            onClick={() => setSectionActive('marges')}
          >
            <IoPieChartOutline />
            Marges Bénéficiaires
          </button>
        </div>

        {/* Section Bilan Global */}
        {sectionActive === 'bilan' && (
          <div className="section-content">
            <div className="section-header">
              <h3>📊 Bilan Global Financier</h3>
              <p>Vue d'ensemble de la situation financière de l'entreprise</p>
            </div>

            <div className="stats-grid">
              {donneesFinances.filter(d => d.type === 'bilan').map((data) => (
                <div key={data.id} className="finance-card bilan">
                  <div className="card-header">
                    <div className="card-icon">
                      {getIconeParType(data.type)}
                    </div>
                    <div className="card-title">
                      <h4>{data.titre}</h4>
                      <span className="date-maj">Mise à jour: {new Date(data.date_mise_a_jour).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="card-statut" style={{ backgroundColor: getCouleurStatut(data.statut) }}>
                      {data.statut}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="montant-principal">
                      <span className="montant">{formatBudget(data.montant)}</span>
                      <span className={`variation ${data.tendance}`}>
                        {data.tendance === 'positive' ? '↗' : data.tendance === 'negative' ? '↘' : '→'} 
                        {data.variation}%
                      </span>
                    </div>
                    
                    <p className="description">{data.description}</p>

                    <div className="details-grid">
                      {data.details.map((detail, index) => (
                        <div key={index} className="detail-item">
                          <div className="detail-header">
                            <span className="detail-label">{detail.label}</span>
                            <span className="detail-valeur">{formatBudget(detail.valeur)}</span>
                          </div>
                          {detail.pourcentage && (
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{ width: `${detail.pourcentage}%` }}
                              ></div>
                              <span className="progress-text">{detail.pourcentage}%</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Trésorerie */}
        {sectionActive === 'tresorerie' && (
          <div className="section-content">
            <div className="section-header">
              <h3>💰 Gestion de Trésorerie</h3>
              <p>Suivi des liquidités et flux de trésorerie</p>
            </div>

            <div className="stats-grid">
              {donneesFinances.filter(d => d.type === 'tresorerie').map((data) => (
                <div key={data.id} className="finance-card tresorerie">
                  <div className="card-header">
                    <div className="card-icon">
                      {getIconeParType(data.type)}
                    </div>
                    <div className="card-title">
                      <h4>{data.titre}</h4>
                      <span className="date-maj">Mise à jour: {new Date(data.date_mise_a_jour).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="card-statut" style={{ backgroundColor: getCouleurStatut(data.statut) }}>
                      {data.statut}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="montant-principal">
                      <span className="montant">{formatBudget(data.montant)}</span>
                      <span className={`variation ${data.tendance}`}>
                        {data.tendance === 'positive' ? '↗' : data.tendance === 'negative' ? '↘' : '→'} 
                        {data.variation}%
                      </span>
                    </div>
                    
                    <p className="description">{data.description}</p>

                    <div className="flux-tresorerie">
                      <h5>Composition de la Trésorerie</h5>
                      <div className="details-grid">
                        {data.details.map((detail, index) => (
                          <div key={index} className="detail-item">
                            <div className="detail-header">
                              <span className="detail-label">{detail.label}</span>
                              <span className="detail-valeur">{formatBudget(detail.valeur)}</span>
                            </div>
                            {detail.pourcentage && (
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${detail.pourcentage}%` }}
                                ></div>
                                <span className="progress-text">{detail.pourcentage}%</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Investissements */}
        {sectionActive === 'investissements' && (
          <div className="section-content">
            <div className="section-header">
              <h3>🏗️ Portefeuille d'Investissements</h3>
              <p>Suivi et analyse des investissements réalisés</p>
            </div>

            {/* Filtres Investissements */}
            <div className="filtres-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  name="recherche"
                  placeholder="Rechercher un investissement..."
                  className="search-input"
                  value={filtres.recherche}
                  onChange={handleFiltreChange}
                />
              </div>
              
              <div className="filter-group">
                <select 
                  name="type_investissement"
                  value={filtres.type_investissement}
                  onChange={handleFiltreChange}
                >
                  <option value="all">Tous les types</option>
                  <option value="tuc_tuc">Tuc Tuc</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="equipement">Équipement</option>
                  <option value="formation">Formation</option>
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

            {/* Cartes Investissements */}
            <div className="investissements-grid">
              {investissementsFiltres.map((invest) => (
                <div key={invest.id} className={`investissement-card ${invest.statut}`}>
                  <div className="invest-header">
                    <div className="invest-icon">
                      {invest.type === 'tuc_tuc' && '🚗'}
                      {invest.type === 'infrastructure' && '🏗️'}
                      {invest.type === 'equipement' && '⚙️'}
                      {invest.type === 'formation' && '👨‍💼'}
                    </div>
                    <div className="invest-info">
                      <h4>{invest.nom}</h4>
                      <div className="invest-meta">
                        <span className={`statut ${invest.statut}`}>
                          {invest.statut === 'actif' && '🟢 Actif'}
                          {invest.statut === 'termine' && '🔵 Terminé'}
                          {invest.statut === 'en_attente' && '🟡 En attente'}
                          {invest.statut === 'suspendu' && '🔴 Suspendu'}
                        </span>
                        <span className="date">
                          <IoCalendarOutline />
                          Début: {new Date(invest.date_debut).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="invest-body">
                    <div className="invest-stats">
                      <div className="stat">
                        <span className="label">Investissement</span>
                        <span className="valeur">{formatBudget(invest.montant_investi)}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Retour Attendu</span>
                        <span className="valeur">{formatBudget(invest.retour_attendu)}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Retour Réel</span>
                        <span className="valeur">{formatBudget(invest.retour_reel)}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Rentabilité</span>
                        <span className={`valeur rentabilite ${invest.rentabilite >= 20 ? 'positive' : 'negative'}`}>
                          {invest.rentabilite}%
                        </span>
                      </div>
                    </div>

                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Progression du Retour</span>
                        <span>{Math.round((invest.retour_reel / invest.retour_attendu) * 100)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${Math.min((invest.retour_reel / invest.retour_attendu) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé Investissements */}
            <div className="resume-investissements">
              <h4>Résumé des Investissements</h4>
              <div className="resume-stats">
                <div className="resume-stat">
                  <span className="label">Total Investi</span>
                  <span className="valeur">
                    {formatBudget(investissementsFiltres.reduce((sum, inv) => sum + inv.montant_investi, 0))}
                  </span>
                </div>
                <div className="resume-stat">
                  <span className="label">Retour Total</span>
                  <span className="valeur">
                    {formatBudget(investissementsFiltres.reduce((sum, inv) => sum + inv.retour_reel, 0))}
                  </span>
                </div>
                <div className="resume-stat">
                  <span className="label">Rentabilité Moyenne</span>
                  <span className="valeur positive">
                    {investissementsFiltres.length > 0 
                      ? (investissementsFiltres.reduce((sum, inv) => sum + inv.rentabilite, 0) / investissementsFiltres.length).toFixed(1)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section Marges Bénéficiaires */}
        {sectionActive === 'marges' && (
          <div className="section-content">
            <div className="section-header">
              <h3>📈 Analyse des Marges Bénéficiaires</h3>
              <p>Performance financière et rentabilité de l'entreprise</p>
            </div>

            <div className="stats-grid">
              {donneesFinances.filter(d => d.type === 'marge').map((data) => (
                <div key={data.id} className="finance-card marge">
                  <div className="card-header">
                    <div className="card-icon">
                      {getIconeParType(data.type)}
                    </div>
                    <div className="card-title">
                      <h4>{data.titre}</h4>
                      <span className="date-maj">Mise à jour: {new Date(data.date_mise_a_jour).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="card-statut" style={{ backgroundColor: getCouleurStatut(data.statut) }}>
                      {data.statut}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="montant-principal">
                      <span className="montant">{formatBudget(data.montant)}</span>
                      <span className={`variation ${data.tendance}`}>
                        {data.tendance === 'positive' ? '↗' : data.tendance === 'negative' ? '↘' : '→'} 
                        {data.variation}%
                      </span>
                    </div>
                    
                    <p className="description">{data.description}</p>

                    <div className="analyse-marges">
                      <h5>Analyse Détaillée des Marges</h5>
                      <div className="details-grid">
                        {data.details.map((detail, index) => (
                          <div key={index} className="detail-item">
                            <div className="detail-header">
                              <span className="detail-label">{detail.label}</span>
                              <span className="detail-valeur">{formatBudget(detail.valeur)}</span>
                            </div>
                            {detail.pourcentage && (
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{ width: `${detail.pourcentage}%` }}
                                ></div>
                                <span className="progress-text">{detail.pourcentage}%</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="indicateurs-performance">
                      <div className="indicateur">
                        <span className="label">Marge Nette</span>
                        <span className="valeur positive">22.5%</span>
                      </div>
                      <div className="indicateur">
                        <span className="label">ROI Global</span>
                        <span className="valeur positive">18.7%</span>
                      </div>
                      <div className="indicateur">
                        <span className="label">Seuil de Rentabilité</span>
                        <span className="valeur positive">Atteint</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

export default ListeFinances;