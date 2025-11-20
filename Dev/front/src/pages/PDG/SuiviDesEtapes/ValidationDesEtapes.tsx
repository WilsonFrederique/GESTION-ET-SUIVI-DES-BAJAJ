import React, { useState, useEffect } from 'react';
import './ValidationDesEtapes.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoFilterOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoTimeOutline,
  IoAlertCircleOutline,
  IoDocumentTextOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoChevronDownOutline,
  IoChevronUpOutline,
  IoRefreshOutline,
  IoDownloadOutline
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

// Interface pour les étapes à valider
interface EtapeValidation {
  id_etape: number;
  id_projet: number;
  nom_projet: string;
  nom_etape: string;
  description: string;
  ordre: number;
  date_fin_prevue: string;
  date_fin_reelle: string | null;
  pourcentage_termine: number;
  est_terminee: boolean;
  en_attente_validation: boolean;
  date_soumission_validation: string | null;
  soumis_par: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  documents: {
    id: number;
    nom: string;
    type: string;
    taille: string;
    date_upload: string;
  }[];
  commentaires_validation: string;
  validations: {
    id_validation: number;
    validateur: string;
    date_validation: string;
    statut: 'approuve' | 'rejete' | 'en_attente';
    commentaires: string;
  }[];
  priorite: 'haute' | 'moyenne' | 'basse';
  jours_retard: number;
}

const ValidationDesEtapes: React.FC = () => {
  const [etapes, setEtapes] = useState<EtapeValidation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState<string>('all');
  const [filterPriorite, setFilterPriorite] = useState<string>('all');
  const [expandedEtapes, setExpandedEtapes] = useState<number[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [selectedEtape, setSelectedEtape] = useState<EtapeValidation | null>(null);
  const [commentaireValidation, setCommentaireValidation] = useState('');

  // Données d'exemple
  useEffect(() => {
    const mockEtapes: EtapeValidation[] = [
      {
        id_etape: 1,
        id_projet: 101,
        nom_projet: "Système de Gestion RH",
        nom_etape: "Conception de l'architecture",
        description: "Conception détaillée de l'architecture technique du système incluant les diagrammes UML et spécifications techniques",
        ordre: 2,
        date_fin_prevue: "2024-03-15",
        date_fin_reelle: "2024-03-20",
        pourcentage_termine: 100,
        est_terminee: true,
        en_attente_validation: true,
        date_soumission_validation: "2024-03-20",
        soumis_par: {
          id: 1,
          nom: "Dupont",
          prenom: "Jean",
          email: "jean.dupont@example.com"
        },
        documents: [
          {
            id: 1,
            nom: "architecture_diagram.pdf",
            type: "PDF",
            taille: "2.4 MB",
            date_upload: "2024-03-20"
          },
          {
            id: 2,
            nom: "specifications_techniques.docx",
            type: "DOCX",
            taille: "1.1 MB",
            date_upload: "2024-03-20"
          }
        ],
        commentaires_validation: "",
        validations: [
          {
            id_validation: 1,
            validateur: "Marie Martin",
            date_validation: "2024-03-21",
            statut: 'approuve',
            commentaires: "Architecture bien conçue et conforme aux standards de l'entreprise"
          }
        ],
        priorite: 'haute',
        jours_retard: 5
      },
      {
        id_etape: 2,
        id_projet: 102,
        nom_projet: "Application Mobile Client",
        nom_etape: "Développement des interfaces",
        description: "Implémentation des interfaces utilisateur principales avec React Native et tests utilisateur",
        ordre: 3,
        date_fin_prevue: "2024-03-10",
        date_fin_reelle: "2024-03-18",
        pourcentage_termine: 100,
        est_terminee: true,
        en_attente_validation: true,
        date_soumission_validation: "2024-03-18",
        soumis_par: {
          id: 2,
          nom: "Bernard",
          prenom: "Pierre",
          email: "pierre.bernard@example.com"
        },
        documents: [
          {
            id: 3,
            nom: "screenshots_mobile.zip",
            type: "ZIP",
            taille: "5.2 MB",
            date_upload: "2024-03-18"
          },
          {
            id: 4,
            nom: "rapport_tests_utilisateurs.pdf",
            type: "PDF",
            taille: "1.8 MB",
            date_upload: "2024-03-18"
          }
        ],
        commentaires_validation: "",
        validations: [],
        priorite: 'moyenne',
        jours_retard: 8
      },
      {
        id_etape: 3,
        id_projet: 103,
        nom_projet: "Migration Base de Données",
        nom_etape: "Tests de performance",
        description: "Tests de performance approfondis et optimisation des requêtes SQL critiques",
        ordre: 4,
        date_fin_prevue: "2024-03-25",
        date_fin_reelle: null,
        pourcentage_termine: 85,
        est_terminee: false,
        en_attente_validation: false,
        date_soumission_validation: null,
        soumis_par: {
          id: 3,
          nom: "Dubois",
          prenom: "Sophie",
          email: "sophie.dubois@example.com"
        },
        documents: [],
        commentaires_validation: "",
        validations: [],
        priorite: 'haute',
        jours_retard: 0
      },
      {
        id_etape: 4,
        id_projet: 101,
        nom_projet: "Système de Gestion RH",
        nom_etape: "Intégration API",
        description: "Intégration des APIs externes (payroll, recrutement) et tests d'intégration complets",
        ordre: 4,
        date_fin_prevue: "2024-03-28",
        date_fin_reelle: null,
        pourcentage_termine: 70,
        est_terminee: false,
        en_attente_validation: false,
        date_soumission_validation: null,
        soumis_par: {
          id: 4,
          nom: "Moreau",
          prenom: "Luc",
          email: "luc.moreau@example.com"
        },
        documents: [],
        commentaires_validation: "",
        validations: [],
        priorite: 'moyenne',
        jours_retard: 0
      },
      {
        id_etape: 5,
        id_projet: 104,
        nom_projet: "Refonte Site Web Corporate",
        nom_etape: "Design responsive",
        description: "Création des maquettes responsive et validation UX avec tests utilisateur sur différents devices",
        ordre: 2,
        date_fin_prevue: "2024-03-12",
        date_fin_reelle: "2024-03-12",
        pourcentage_termine: 100,
        est_terminee: true,
        en_attente_validation: true,
        date_soumission_validation: "2024-03-12",
        soumis_par: {
          id: 5,
          nom: "Leroy",
          prenom: "Alice",
          email: "alice.leroy@example.com"
        },
        documents: [
          {
            id: 5,
            nom: "maquettes_figma_v1.2.zip",
            type: "ZIP",
            taille: "8.7 MB",
            date_upload: "2024-03-12"
          },
          {
            id: 6,
            nom: "rapport_ux_research.pdf",
            type: "PDF",
            taille: "3.2 MB",
            date_upload: "2024-03-12"
          }
        ],
        commentaires_validation: "",
        validations: [],
        priorite: 'basse',
        jours_retard: 0
      }
    ];
    
    setEtapes(mockEtapes);
  }, []);

  // Filtrer les étapes
  const filteredEtapes = etapes.filter(etape => {
    const matchesSearch = 
      etape.nom_etape.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etape.nom_projet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      etape.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatut = filterStatut === 'all' || 
      (filterStatut === 'en_attente' && etape.en_attente_validation) ||
      (filterStatut === 'valide' && etape.est_terminee && !etape.en_attente_validation) ||
      (filterStatut === 'en_cours' && !etape.est_terminee);
    
    const matchesPriorite = filterPriorite === 'all' || etape.priorite === filterPriorite;
    
    return matchesSearch && matchesStatut && matchesPriorite;
  });

  // Gérer l'expansion des étapes
  const toggleEtapeExpansion = (idEtape: number) => {
    setExpandedEtapes(prev => 
      prev.includes(idEtape) 
        ? prev.filter(id => id !== idEtape)
        : [...prev, idEtape]
    );
  };

  // Ouvrir la modal de validation
  const openValidationModal = (etape: EtapeValidation) => {
    setSelectedEtape(etape);
    setCommentaireValidation('');
    setValidationModalOpen(true);
  };

  // Valider une étape
  const handleValidation = (statut: 'approuve' | 'rejete') => {
    if (!selectedEtape) return;

    const nouvelleValidation = {
      id_validation: Date.now(),
      validateur: "Admin System", // En pratique, récupérer l'utilisateur connecté
      date_validation: new Date().toISOString().split('T')[0],
      statut,
      commentaires: commentaireValidation
    };

    setEtapes(prev => prev.map(etape => 
      etape.id_etape === selectedEtape.id_etape 
        ? { 
            ...etape, 
            en_attente_validation: false,
            validations: [...etape.validations, nouvelleValidation],
            commentaires_validation: commentaireValidation
          }
        : etape
    ));

    setValidationModalOpen(false);
    setSnackbarMessage(`Étape "${selectedEtape.nom_etape}" ${statut === 'approuve' ? 'approuvée' : 'rejetée'} avec succès`);
    setSnackbarSeverity(statut === 'approuve' ? 'success' : 'error');
    setSnackbarOpen(true);
  };

  // Télécharger un document
  const handleDownloadDocument = (documentId: number, documentName: string) => {
    // Simulation de téléchargement
    setSnackbarMessage(`Téléchargement de "${documentName}" démarré`);
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };

  // Obtenir la couleur du statut
  const getStatutColor = (etape: EtapeValidation) => {
    if (etape.en_attente_validation) return 'linear-gradient(135deg, #f59e0b, #d97706)';
    if (etape.est_terminee && !etape.en_attente_validation) return 'linear-gradient(135deg, #10b981, #059669)';
    return 'linear-gradient(135deg, #3b82f6, #2563eb)';
  };

  // Obtenir le texte du statut
  const getStatutText = (etape: EtapeValidation) => {
    if (etape.en_attente_validation) return 'En attente de validation';
    if (etape.est_terminee && !etape.en_attente_validation) return 'Validée';
    return 'En cours';
  };

  // Obtenir l'icône du statut
  const getStatutIcon = (etape: EtapeValidation) => {
    if (etape.en_attente_validation) return <IoTimeOutline />;
    if (etape.est_terminee && !etape.en_attente_validation) return <IoCheckmarkCircleOutline />;
    return <IoAlertCircleOutline />;
  };

  // Obtenir la couleur de priorité
  const getPrioriteColor = (priorite: string) => {
    switch(priorite) {
      case 'haute': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'moyenne': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      case 'basse': return 'linear-gradient(135deg, #10b981, #059669)';
      default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
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
    en_attente: etapes.filter(e => e.en_attente_validation).length,
    validees: etapes.filter(e => e.est_terminee && !e.en_attente_validation).length,
    en_retard: etapes.filter(e => e.jours_retard > 0).length
  };

  return (
    <div className="validation-etapes-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <h5 className="mb-0">Validation des Étapes</h5>
            <p className="mb-0 subtitle">Gestion et validation des étapes de projet</p>
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
                label="Validation des Étapes"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Statistiques */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon total">📋</div>
            <div className="stat-info">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total étapes</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon pending">⏳</div>
            <div className="stat-info">
              <span className="stat-number">{stats.en_attente}</span>
              <span className="stat-label">En attente</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon validated">✅</div>
            <div className="stat-info">
              <span className="stat-number">{stats.validees}</span>
              <span className="stat-label">Validées</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon delayed">⚠️</div>
            <div className="stat-info">
              <span className="stat-number">{stats.en_retard}</span>
              <span className="stat-label">En retard</span>
            </div>
          </div>
        </div>

        {/* Actions et Recherche */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="validation-actions">
            <div className="search-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher une étape ou projet..."
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
                    <option value="en_attente">En attente</option>
                    <option value="valide">Validé</option>
                    <option value="en_cours">En cours</option>
                  </select>
                </div>
                
                <div className="filter-group">
                  <select 
                    value={filterPriorite}
                    onChange={(e) => setFilterPriorite(e.target.value)}
                  >
                    <option value="all">Toutes priorités</option>
                    <option value="haute">Haute</option>
                    <option value="moyenne">Moyenne</option>
                    <option value="basse">Basse</option>
                  </select>
                </div>
                
                <button className="btn-refresh" onClick={() => window.location.reload()}>
                  <IoRefreshOutline />
                  Actualiser
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des Étapes à Valider */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="etapes-validation-list">
            {filteredEtapes.length > 0 ? (
              filteredEtapes.map(etape => (
                <div key={etape.id_etape} className="validation-card">
                  <div className="validation-header">
                    <div className="validation-main-info">
                      <div className="projet-info">
                        <span className="projet-nom">{etape.nom_projet}</span>
                        <span className="etape-ordre">Étape #{etape.ordre}</span>
                      </div>
                      
                      <div className="etape-title-section">
                        <h4 className="etape-title">{etape.nom_etape}</h4>
                        <div className="etape-meta">
                          <span 
                            className="statut-badge"
                            style={{ background: getStatutColor(etape) }}
                          >
                            <span className="statut-icon">{getStatutIcon(etape)}</span>
                            {getStatutText(etape)}
                          </span>
                          
                          <span 
                            className="priorite-badge"
                            style={{ background: getPrioriteColor(etape.priorite) }}
                          >
                            {etape.priorite}
                          </span>
                          
                          <span className="soumission-info">
                            <IoPersonOutline />
                            Soumis par {etape.soumis_par.prenom} {etape.soumis_par.nom}
                          </span>
                          
                          {etape.date_soumission_validation && (
                            <span className="date-soumission">
                              <IoCalendarOutline />
                              {formatDate(etape.date_soumission_validation)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="validation-controls">
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
                              backgroundColor: etape.en_attente_validation ? '#f59e0b' : 
                                             etape.est_terminee ? '#10b981' : '#3b82f6'
                            }
                          }}
                        />
                      </div>
                      
                      <div className="action-buttons">
                        {etape.en_attente_validation && (
                          <>
                            <button 
                              className="btn-action approve"
                              onClick={() => openValidationModal(etape)}
                              title="Approuver l'étape"
                            >
                              <IoCheckmarkCircleOutline />
                            </button>
                            <button 
                              className="btn-action reject"
                              onClick={() => openValidationModal(etape)}
                              title="Rejeter l'étape"
                            >
                              <IoCloseCircleOutline />
                            </button>
                          </>
                        )}
                        
                        <button 
                          className="btn-action view"
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

                  {/* Détails de validation (expandable) */}
                  {expandedEtapes.includes(etape.id_etape) && (
                    <div className="validation-details">
                      <div className="details-grid">
                        <div className="detail-section">
                          <h5>Description</h5>
                          <p>{etape.description}</p>
                          
                          <div className="dates-info">
                            <div className="date-item">
                              <label>Fin prévue:</label>
                              <span>{formatDate(etape.date_fin_prevue)}</span>
                            </div>
                            <div className="date-item">
                              <label>Fin réelle:</label>
                              <span>{formatDate(etape.date_fin_reelle)}</span>
                            </div>
                            {etape.jours_retard > 0 && (
                              <div className="date-item retard">
                                <label>Retard:</label>
                                <span>+{etape.jours_retard} jours</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="detail-section">
                          <h5>Documents soumis ({etape.documents.length})</h5>
                          {etape.documents.length > 0 ? (
                            <div className="documents-list">
                              {etape.documents.map(doc => (
                                <div key={doc.id} className="document-item">
                                  <IoDocumentTextOutline className="document-icon" />
                                  <div className="document-info">
                                    <span className="document-nom">{doc.nom}</span>
                                    <span className="document-meta">{doc.type} • {doc.taille} • {formatDate(doc.date_upload)}</span>
                                  </div>
                                  <button 
                                    className="btn-download" 
                                    onClick={() => handleDownloadDocument(doc.id, doc.nom)}
                                    title="Télécharger le document"
                                  >
                                    <IoDownloadOutline />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="no-documents">Aucun document soumis</p>
                          )}
                        </div>
                        
                        <div className="detail-section">
                          <h5>Historique de validation ({etape.validations.length})</h5>
                          {etape.validations.length > 0 ? (
                            <div className="validations-list">
                              {etape.validations.map(validation => (
                                <div key={validation.id_validation} className={`validation-item ${validation.statut}`}>
                                  <div className="validation-header">
                                    <span className="validateur">{validation.validateur}</span>
                                    <span className="validation-date">{formatDate(validation.date_validation)}</span>
                                  </div>
                                  <div className={`validation-statut ${validation.statut}`}>
                                    {validation.statut === 'approuve' ? 'Approuvé' : 'Rejeté'}
                                  </div>
                                  {validation.commentaires && (
                                    <p className="validation-comment">{validation.commentaires}</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="no-validations">Aucune validation effectuée</p>
                          )}
                        </div>
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

        {/* Modal de Validation Personnalisée */}
        {validationModalOpen && selectedEtape && (
          <div className="validation-modal-overlay">
            <div className="validation-modal">
              <div className="modal-header">
                <h3>Validation de l'étape</h3>
                <button 
                  className="modal-close"
                  onClick={() => setValidationModalOpen(false)}
                >
                  ×
                </button>
              </div>
              
              <div className="modal-content">
                <div className="etape-info">
                  <h4>{selectedEtape.nom_etape}</h4>
                  <p className="projet-info">Projet: {selectedEtape.nom_projet}</p>
                  <p className="description">{selectedEtape.description}</p>
                </div>
                
                <div className="documents-section">
                  <h5>Documents soumis ({selectedEtape.documents.length})</h5>
                  <div className="documents-list">
                    {selectedEtape.documents.map(doc => (
                      <div key={doc.id} className="document-item">
                        <IoDocumentTextOutline className="document-icon" />
                        <div className="document-info">
                          <span className="document-nom">{doc.nom}</span>
                          <span className="document-meta">{doc.type} • {doc.taille}</span>
                        </div>
                        <button 
                          className="btn-download" 
                          onClick={() => handleDownloadDocument(doc.id, doc.nom)}
                          title="Télécharger"
                        >
                          <IoDownloadOutline />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="commentaire-section">
                  <label htmlFor="commentaire">Commentaire de validation</label>
                  <textarea
                    id="commentaire"
                    value={commentaireValidation}
                    onChange={(e) => setCommentaireValidation(e.target.value)}
                    placeholder="Ajoutez un commentaire pour justifier votre décision..."
                    rows={4}
                  />
                </div>
              </div>
              
              <div className="modal-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => setValidationModalOpen(false)}
                >
                  Annuler
                </button>
                <button 
                  className="btn-reject"
                  onClick={() => handleValidation('rejete')}
                >
                  <IoCloseCircleOutline />
                  Rejeter
                </button>
                <button 
                  className="btn-approve"
                  onClick={() => handleValidation('approuve')}
                >
                  <IoCheckmarkCircleOutline />
                  Approuver
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

export default ValidationDesEtapes;