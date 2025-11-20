import React, { useState, useEffect } from 'react';
import './SuiviDesEtapes.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoFilterOutline,
  IoAddOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoCalendarOutline,
  IoPersonOutline,
  IoCashOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCloseOutline
} from "react-icons/io5";
import { 
  Chip, 
  emphasize, 
  styled,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';

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

// Interface pour les étapes de projet
interface EtapeProjet {
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

const SuiviDesEtapes: React.FC = () => {
  const navigate = useNavigate();
  const [etapes, setEtapes] = useState<EtapeProjet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [expandedEtapes, setExpandedEtapes] = useState<number[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [etapeToDelete, setEtapeToDelete] = useState<EtapeProjet | null>(null);

  // Données d'exemple
  useEffect(() => {
    const mockEtapes: EtapeProjet[] = [
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
      },
      {
        id_etape: 4,
        nom_etape: "Tests et validation",
        description: "Tests qualité et validation utilisateur",
        ordre: 4,
        date_debut_prevue: "2024-07-16",
        date_fin_prevue: "2024-09-15",
        date_debut_reelle: null,
        date_fin_reelle: null,
        est_terminee: false,
        pourcentage_termine: 0,
        cout_prevue: 25000,
        cout_reel: null,
        id_utilisateur_responsable: 4,
        responsable_nom: "Dubois",
        responsable_prenom: "Sophie",
        statut: 'a_venir',
        jours_retard: 0
      },
      {
        id_etape: 5,
        nom_etape: "Déploiement",
        description: "Mise en production et formation",
        ordre: 5,
        date_debut_prevue: "2024-09-16",
        date_fin_prevue: "2024-10-15",
        date_debut_reelle: null,
        date_fin_reelle: null,
        est_terminee: false,
        pourcentage_termine: 0,
        cout_prevue: 15000,
        cout_reel: null,
        id_utilisateur_responsable: 5,
        responsable_nom: "Moreau",
        responsable_prenom: "Luc",
        statut: 'a_venir',
        jours_retard: 0
      }
    ];
    
    setEtapes(mockEtapes);
  }, []);

  // Filtrer les étapes
  const filteredEtapes = etapes.filter(etape => {
    const matchesSearch = 
      etape.nom_etape.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etape.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = filterStatut === 'all' || etape.statut === filterStatut;
    
    return matchesSearch && matchesStatut;
  });

  // Gérer l'expansion des étapes
  const toggleEtapeExpansion = (idEtape: number) => {
    setExpandedEtapes(prev => 
      prev.includes(idEtape) 
        ? prev.filter(id => id !== idEtape)
        : [...prev, idEtape]
    );
  };

  // Marquer une étape comme terminée
  const handleMarkAsCompleted = (etape: EtapeProjet) => {
    setEtapes(prev => prev.map(e => 
      e.id_etape === etape.id_etape 
        ? { 
            ...e, 
            est_terminee: true, 
            pourcentage_termine: 100,
            date_fin_reelle: new Date().toISOString().split('T')[0],
            statut: 'termine'
          }
        : e
    ));
    setSnackbarMessage(`Étape "${etape.nom_etape}" marquée comme terminée`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Modifier une étape
  const handleModifierEtape = (etape: EtapeProjet) => {
    navigate(`/modifier-etape/${etape.id_etape}`, {
      state: { etape }
    });
  };

  // Ouvrir la modal de confirmation de suppression
  const handleOpenDeleteModal = (etape: EtapeProjet) => {
    setEtapeToDelete(etape);
    setDeleteModalOpen(true);
  };

  // Fermer la modal de suppression
  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setEtapeToDelete(null);
  };

  // Confirmer la suppression
  const handleConfirmDelete = () => {
    if (etapeToDelete) {
      setEtapes(prev => prev.filter(e => e.id_etape !== etapeToDelete.id_etape));
      setSnackbarMessage(`Étape "${etapeToDelete.nom_etape}" supprimée avec succès`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      handleCloseDeleteModal();
    }
  };

  // Obtenir la couleur du statut
  const getStatutColor = (statut: string) => {
    switch(statut) {
      case 'termine': return 'linear-gradient(135deg, #10b981, #059669)';
      case 'en_cours': return 'linear-gradient(135deg, #3b82f6, #2563eb)';
      case 'en_retard': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'a_venir': return 'linear-gradient(135deg, #6b7280, #4b5563)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
    }
  };

  // Obtenir l'icône du statut
  const getStatutIcon = (statut: string) => {
    switch(statut) {
      case 'termine': return <IoCheckmarkCircleOutline />;
      case 'en_cours': return <IoTimeOutline />;
      case 'en_retard': return <IoAlertCircleOutline />;
      case 'a_venir': return <IoCalendarOutline />;
      default: return <IoCalendarOutline />;
    }
  };

  // Formater la date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non définie';
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Calculer les statistiques
  const stats = {
    total: etapes.length,
    terminees: etapes.filter(e => e.est_terminee).length,
    en_retard: etapes.filter(e => e.statut === 'en_retard').length,
    progression_moyenne: Math.round(etapes.reduce((sum, e) => sum + e.pourcentage_termine, 0) / etapes.length)
  };

  return (
    <div className="suivi-etapes-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <h5 className="mb-0">Suivi des Étapes de Projet</h5>
            <p className="mb-0 subtitle">Planification et suivi détaillé des étapes</p>
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
                label="Suivi des Étapes"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Statistiques */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon total">📊</div>
            <div className="stat-info">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total étapes</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon completed">✅</div>
            <div className="stat-info">
              <span className="stat-number">{stats.terminees}</span>
              <span className="stat-label">Étapes terminées</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon delayed">⚠️</div>
            <div className="stat-info">
              <span className="stat-number">{stats.en_retard}</span>
              <span className="stat-label">Étapes en retard</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon progress">📈</div>
            <div className="stat-info">
              <span className="stat-number">{stats.progression_moyenne}%</span>
              <span className="stat-label">Progression moyenne</span>
            </div>
          </div>
        </div>

        {/* Actions et Recherche */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="etapes-actions">
            <div className="search-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher une étape..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="filters-container">
              <button 
                className="mobile-filter-btn"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              >
                <IoFilterOutline />
                Filtres
              </button>

              <div className={`filter-groups ${mobileFiltersOpen ? 'mobile-open' : ''}`}>
                <div className="filter-group">
                  <select 
                    value={filterStatut}
                    onChange={(e) => setFilterStatut(e.target.value)}
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="termine">Terminé</option>
                    <option value="en_cours">En cours</option>
                    <option value="en_retard">En retard</option>
                    <option value="a_venir">À venir</option>
                  </select>
                </div>
                
                <a href="/frmDesEtapes">
                    <button className="btn-add-etape">
                        <IoAddOutline />
                        Nouvelle étape
                    </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des Étapes */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="etapes-list">
            {filteredEtapes.length > 0 ? (
              filteredEtapes.map(etape => (
                <div key={etape.id_etape} className={`etape-card ${etape.statut}`}>
                  <div className="etape-header">
                    <div className="etape-main-info">
                      <div className="etape-order">#{etape.ordre}</div>
                      <div className="etape-title-section">
                        <h4 className="etape-title">{etape.nom_etape}</h4>
                        <div className="etape-meta">
                          <span 
                            className="statut-badge"
                            style={{ background: getStatutColor(etape.statut) }}
                          >
                            <span className="statut-icon">{getStatutIcon(etape.statut)}</span>
                            {etape.statut.replace('_', ' ')}
                            {etape.jours_retard > 0 && (
                              <span className="retard-indicator">+{etape.jours_retard}j</span>
                            )}
                          </span>
                          
                          <span className="responsable-info">
                            <IoPersonOutline />
                            {etape.responsable_prenom} {etape.responsable_nom}
                          </span>
                          
                          <span className="cout-info">
                            <IoCashOutline />
                            {etape.cout_reel ? `${etape.cout_reel.toLocaleString()}€` : `${etape.cout_prevue.toLocaleString()}€ (prévu)`}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="etape-controls">
                      <div className="progression-section">
                        <div className="progression-header">
                          <span>Progression</span>
                          <span className="progression-value">{etape.pourcentage_termine}%</span>
                        </div>
                        <LinearProgress 
                          variant="determinate" 
                          value={etape.pourcentage_termine}
                          className="progression-bar"
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: etape.statut === 'en_retard' ? '#ef4444' : 
                                             etape.statut === 'termine' ? '#10b981' : '#3b82f6'
                            }
                          }}
                        />
                      </div>
                      
                      <div className="action-buttons">
                        {!etape.est_terminee && (
                          <button 
                            className="btn-action complete"
                            onClick={() => handleMarkAsCompleted(etape)}
                            title="Marquer comme terminée"
                          >
                            <IoCheckmarkCircleOutline />
                          </button>
                        )}
                        
                        <button 
                          className="btn-action edit"
                          onClick={() => handleModifierEtape(etape)}
                          title="Modifier l'étape"
                        >
                          <IoPencilOutline />
                        </button>
                        
                        <button 
                          className="btn-action delete"
                          onClick={() => handleOpenDeleteModal(etape)}
                          title="Supprimer l'étape"
                        >
                          <IoTrashOutline />
                        </button>
                        
                        <button 
                          className="btn-action expand"
                          onClick={() => toggleEtapeExpansion(etape.id_etape)}
                          title="Voir les détails"
                        >
                          {expandedEtapes.includes(etape.id_etape) ? 
                            <IoChevronUpOutline /> : 
                            <IoChevronDownOutline />
                          }
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Détails de l'étape (expandable) */}
                  {expandedEtapes.includes(etape.id_etape) && (
                    <div className="etape-details">
                      <div className="details-grid">
                        <div className="detail-section">
                          <h5>Description</h5>
                          <p>{etape.description}</p>
                        </div>
                        
                        <div className="detail-section">
                          <h5>Planning</h5>
                          <div className="planning-dates">
                            <div className="date-item">
                              <label>Début prévu:</label>
                              <span>{formatDate(etape.date_debut_prevue)}</span>
                            </div>
                            <div className="date-item">
                              <label>Fin prévue:</label>
                              <span>{formatDate(etape.date_fin_prevue)}</span>
                            </div>
                            <div className="date-item">
                              <label>Début réel:</label>
                              <span>{formatDate(etape.date_debut_reelle)}</span>
                            </div>
                            <div className="date-item">
                              <label>Fin réelle:</label>
                              <span>{formatDate(etape.date_fin_reelle)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="detail-section">
                          <h5>Budget</h5>
                          <div className="budget-info">
                            <div className="budget-item">
                              <label>Coût prévu:</label>
                              <span>{etape.cout_prevue.toLocaleString()}€</span>
                            </div>
                            <div className="budget-item">
                              <label>Coût réel:</label>
                              <span className={etape.cout_reel && etape.cout_reel > etape.cout_prevue ? 'over-budget' : ''}>
                                {etape.cout_reel ? `${etape.cout_reel.toLocaleString()}€` : 'Non défini'}
                              </span>
                            </div>
                            {etape.cout_reel && (
                              <div className="budget-item">
                                <label>Écart:</label>
                                <span className={etape.cout_reel > etape.cout_prevue ? 'over-budget' : 'under-budget'}>
                                  {(etape.cout_reel - etape.cout_prevue).toLocaleString()}€
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="validation-section">
                        <h5>Validation</h5>
                        {etape.est_terminee ? (
                          <div className="validation-status validated">
                            <IoCheckmarkCircleOutline />
                            <span>Étape validée le {formatDate(etape.date_fin_reelle)}</span>
                          </div>
                        ) : (
                          <div className="validation-status pending">
                            <IoTimeOutline />
                            <span>En attente de validation</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>Aucune étape trouvée</p>
                <small>Essayez de modifier vos critères de recherche</small>
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmation de suppression */}
        {deleteModalOpen && (
          <div className="modal-overlay">
            <div className="modal-container">
              <div className="modal-header">
                <div className="modal-title">
                  <IoAlertCircleOutline className="modal-title-icon" />
                  <h3>Confirmation de suppression</h3>
                </div>
                <button 
                  className="modal-close-btn"
                  onClick={handleCloseDeleteModal}
                  aria-label="Fermer la modal"
                >
                  <IoCloseOutline />
                </button>
              </div>

              <div className="modal-content">
                <div className="modal-message">
                  <p>
                    Êtes-vous sûr de vouloir supprimer l'étape 
                    <strong> "{etapeToDelete?.nom_etape}"</strong> ?
                  </p>
                  <p className="warning-text">
                    ⚠️ Cette action est irréversible et supprimera définitivement l'étape.
                  </p>
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-modal btn-cancel"
                  onClick={handleCloseDeleteModal}
                >
                  Annuler
                </button>
                <button 
                  className="btn-modal btn-delete"
                  onClick={handleConfirmDelete}
                >
                  <IoTrashOutline />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notification */}
        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={4000} 
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setSnackbarOpen(false)} 
            severity={snackbarSeverity}
            className="snackbar-alert"
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SuiviDesEtapes;