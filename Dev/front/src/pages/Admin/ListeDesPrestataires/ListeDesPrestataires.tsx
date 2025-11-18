import React, { useState, useEffect, ChangeEvent } from 'react';
import './ListeDesPrestataires.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoFilterOutline,
  IoAddOutline,
  IoBusinessOutline,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoStarOutline,
  IoStar,
  IoCheckmarkCircleOutline,
  IoDocumentTextOutline,
  IoPeopleOutline,
  IoEyeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoCloseOutline,
  IoCheckmarkOutline
} from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';
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

// Interfaces TypeScript
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

interface Filtres {
  recherche: string;
  type_entreprise: string;
  domaine_competence: string;
  est_certifie: string;
  est_actif: string;
  region: string;
}

const ListeDesPrestataires: React.FC = () => {
  const navigate = useNavigate();
  const [prestataires, setPrestataires] = useState<Prestataire[]>([]);
  const [filtres, setFiltres] = useState<Filtres>({
    recherche: '',
    type_entreprise: 'all',
    domaine_competence: 'all',
    est_certifie: 'all',
    est_actif: 'all',
    region: 'all'
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [prestataireToDelete, setPrestataireToDelete] = useState<Prestataire | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

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

    setPrestataires(mockPrestataires);
    setLoading(false);
  }, []);

  // Gestion des changements de filtres
  const handleFiltreChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFiltres(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Filtrage des prestataires
  const prestatairesFiltres = prestataires.filter(prestataire => {
    const matchesRecherche = 
      prestataire.raison_sociale.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      prestataire.domaine_competence.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      prestataire.email.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      prestataire.region.toLowerCase().includes(filtres.recherche.toLowerCase());

    const matchesType = filtres.type_entreprise === 'all' || prestataire.type_entreprise === filtres.type_entreprise;
    const matchesDomaine = filtres.domaine_competence === 'all' || prestataire.domaine_competence === filtres.domaine_competence;
    const matchesCertifie = filtres.est_certifie === 'all' || 
      (filtres.est_certifie === 'true' && prestataire.est_certifie) ||
      (filtres.est_certifie === 'false' && !prestataire.est_certifie);
    const matchesActif = filtres.est_actif === 'all' || 
      (filtres.est_actif === 'true' && prestataire.est_actif) ||
      (filtres.est_actif === 'false' && !prestataire.est_actif);
    const matchesRegion = filtres.region === 'all' || prestataire.region === filtres.region;

    return matchesRecherche && matchesType && matchesDomaine && matchesCertifie && matchesActif && matchesRegion;
  });

  // Options pour les filtres
  const typesEntreprise = ['SARL', 'SA', 'EI', 'ONG', 'Association'];
  const domainesCompetence = [...new Set(prestataires.map(p => p.domaine_competence))];
  const regions = [...new Set(prestataires.map(p => p.region))];

  const handleVoirDetails = (prestataire: Prestataire): void => {
    navigate(`/prestataire/${prestataire.id_prestataire}`);
  };

  // Modification d'un prestataire
  const handleModifier = (prestataire: Prestataire): void => {
    navigate(`/modifier-prestataire/${prestataire.id_prestataire}`, {
      state: { prestataire }
    });
  };

  // Suppression d'un prestataire
  const handleSupprimerClick = (prestataire: Prestataire): void => {
    setPrestataireToDelete(prestataire);
    setShowDeleteModal(true);
  };

  const confirmSuppression = (): void => {
    if (prestataireToDelete) {
      setPrestataires(prev => prev.filter(p => p.id_prestataire !== prestataireToDelete.id_prestataire));
      setShowDeleteModal(false);
      setPrestataireToDelete(null);
    }
  };

  const annulerSuppression = (): void => {
    setShowDeleteModal(false);
    setPrestataireToDelete(null);
  };

  // Formatage de la date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
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

  if (loading) {
    return (
      <div className="prestataires-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des prestataires...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prestataires-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <h5 className="mb-0">Gestion des Prestataires</h5>
            <p className="mb-0 subtitle">Liste et gestion de tous vos prestataires</p>
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
                label="Prestataires"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Statistiques */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon total">
              <IoBusinessOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{prestataires.length}</span>
              <span className="stat-label">Total prestataires</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon certified">
              <IoCheckmarkCircleOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">
                {prestataires.filter(p => p.est_certifie).length}
              </span>
              <span className="stat-label">Prestataires certifiés</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon active">
              <IoPeopleOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">
                {prestataires.filter(p => p.est_actif).length}
              </span>
              <span className="stat-label">Prestataires actifs</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon rating">
              <IoStar />
            </div>
            <div className="stat-info">
              <span className="stat-number">
                {prestataires.length > 0 
                  ? (prestataires.reduce((sum, p) => sum + p.note_moyenne, 0) / prestataires.length).toFixed(1)
                  : '0.0'
                }
              </span>
              <span className="stat-label">Note moyenne</span>
            </div>
          </div>
        </div>

        {/* Recherche et Filtres */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="prestataires-actions">
            <div className="search-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  name="recherche"
                  placeholder="Rechercher un prestataire..."
                  className="search-input"
                  value={filtres.recherche}
                  onChange={handleFiltreChange}
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
                    name="type_entreprise"
                    value={filtres.type_entreprise}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Tous les types</option>
                    {typesEntreprise.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="domaine_competence"
                    value={filtres.domaine_competence}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Tous les domaines</option>
                    {domainesCompetence.map(domaine => (
                      <option key={domaine} value={domaine}>{domaine}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="est_certifie"
                    value={filtres.est_certifie}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Certification</option>
                    <option value="true">Certifié</option>
                    <option value="false">Non certifié</option>
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="est_actif"
                    value={filtres.est_actif}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Statut</option>
                    <option value="true">Actif</option>
                    <option value="false">Inactif</option>
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="region"
                    value={filtres.region}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Toutes régions</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                <a href="/frmDesPrestataires">
                    <button className="btn-add-prestataire">
                        <IoAddOutline />
                        Nouveau
                    </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des Prestataires */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="prestataires-list">
            {prestatairesFiltres.length > 0 ? (
              prestatairesFiltres.map(prestataire => (
                <div key={prestataire.id_prestataire} className="prestataire-card">
                  <div className="prestataire-header">
                    <div className="prestataire-main-info">
                      <div className="prestataire-avatar">
                        <IoBusinessOutline />
                      </div>
                      <div className="prestataire-title-section">
                        <div className="title-row">
                          <h4 className="prestataire-title">{prestataire.raison_sociale}</h4>
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

                        </div>
                        <span className="rating">
                            <div className="mt-3 stars">
                                {renderStars(prestataire.note_moyenne)}
                                <span className="rating-value">({prestataire.note_moyenne.toFixed(1)})</span>
                            </div>
                        </span>
                      </div>
                    </div>
                    
                    <div className="prestataire-actions">
                      <button 
                        className="btn-action primary"
                        onClick={() => handleVoirDetails(prestataire)}
                        title="Voir les détails"
                      >
                        <IoEyeOutline />
                        Détails
                      </button>
                      
                      <button 
                        className="btn-action secondary"
                        onClick={() => handleModifier(prestataire)}
                        title="Modifier"
                      >
                        <IoPencilOutline />
                        Modifier
                      </button>

                      <button 
                        className="btn-action danger"
                        onClick={() => handleSupprimerClick(prestataire)}
                        title="Supprimer"
                      >
                        <IoTrashOutline />
                        Supprimer
                      </button>
                    </div>
                  </div>

                  <div className="prestataire-details">
                    <div className="contact-info">
                      <div className="contact-item">
                        <IoMailOutline />
                        <span>{prestataire.email}</span>
                      </div>
                      <div className="contact-item">
                        <IoCallOutline />
                        <span>{prestataire.telephone}</span>
                      </div>
                      <div className="contact-item">
                        <IoLocationOutline />
                        <span>{prestataire.adresse}</span>
                      </div>
                    </div>
                    
                    <div className="additional-info">
                      <div className="info-item">
                        <strong>SIRET:</strong> {prestataire.siret}
                      </div>
                      <div className="info-item">
                        <strong>Inscrit le:</strong> {formatDate(prestataire.date_inscription)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <p>Aucun prestataire trouvé</p>
                <small>Essayez de modifier vos critères de recherche</small>
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmation de suppression */}
        {showDeleteModal && prestataireToDelete && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Confirmer la suppression</h3>
              </div>
              <div className="modal-body">
                <p>
                  Êtes-vous sûr de vouloir supprimer le prestataire <strong>"{prestataireToDelete.raison_sociale}"</strong> ?
                </p>
                <p className="warning-text">
                  Cette action est irréversible et supprimera toutes les données associées à ce prestataire.
                </p>
              </div>
              <div className="modal-actions">
                <button 
                  className="btn-modal btn-cancel"
                  onClick={annulerSuppression}
                >
                  <IoCloseOutline />
                  Annuler
                </button>
                <button 
                  className="btn-modal btn-confirm"
                  onClick={confirmSuppression}
                >
                  <IoCheckmarkOutline />
                  Confirmer
                </button>
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

export default ListeDesPrestataires;