import React, { useState, useEffect } from 'react';
import './Utilisateurs.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoFilterOutline,
  IoAddOutline,
  IoEyeOutline,
  IoPencilOutline,
  IoTrashOutline,
  IoRefreshOutline,
  IoDownloadOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoPersonOutline,
  IoLockOpenOutline,
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoCalendarOutline,
  IoBusinessOutline
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

// Interfaces TypeScript basées sur votre structure
interface Utilisateur {
  id_utilisateur: number;
  nom: string;
  prenom: string;
  image?: string;
  email: string;
  mot_de_passe_hash: string;
  role: 'admin' | 'agent' | 'responsable' | 'decideur';
  telephone: string;
  region: string;
  date_creation: string;
  derniere_connexion: string | null;
  est_actif: boolean;
  id_superieur?: number;
  superieur?: string; // Nom du supérieur pour l'affichage
}

interface Filtres {
  recherche: string;
  role: string;
  region: string;
  statut: string;
}

const Utilisateurs: React.FC = () => {
  const navigate = useNavigate();
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [filtres, setFiltres] = useState<Filtres>({
    recherche: '',
    role: 'all',
    region: 'all',
    statut: 'all'
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('tous');

  // Données mock basées sur votre structure
  useEffect(() => {
    const mockUtilisateurs: Utilisateur[] = [
      {
        id_utilisateur: 1,
        nom: 'Diallo',
        prenom: 'Amadou',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        email: 'amadou.diallo@fid.sn',
        mot_de_passe_hash: 'hashed_password',
        role: 'admin',
        telephone: '+221 77 123 45 67',
        region: 'Dakar',
        date_creation: '2024-01-15T08:00:00',
        derniere_connexion: '2024-03-20T14:30:00',
        est_actif: true
      },
      {
        id_utilisateur: 2,
        nom: 'Ndiaye',
        prenom: 'Fatou',
        image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
        email: 'fatou.ndiaye@fid.sn',
        mot_de_passe_hash: 'hashed_password',
        role: 'responsable',
        telephone: '+221 76 234 56 78',
        region: 'Thiès',
        date_creation: '2024-02-01T09:15:00',
        derniere_connexion: '2024-03-20T10:20:00',
        est_actif: true,
        id_superieur: 1,
        superieur: 'Amadou Diallo'
      },
      {
        id_utilisateur: 3,
        nom: 'Sow',
        prenom: 'Moussa',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        email: 'moussa.sow@fid.sn',
        mot_de_passe_hash: 'hashed_password',
        role: 'agent',
        telephone: '+221 70 345 67 89',
        region: 'Saint-Louis',
        date_creation: '2024-01-20T11:30:00',
        derniere_connexion: '2024-03-19T16:45:00',
        est_actif: true,
        id_superieur: 2,
        superieur: 'Fatou Ndiaye'
      },
      {
        id_utilisateur: 4,
        nom: 'Kane',
        prenom: 'Aissatou',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        email: 'aissatou.kane@fid.sn',
        mot_de_passe_hash: 'hashed_password',
        role: 'decideur',
        telephone: '+221 78 456 78 90',
        region: 'Dakar',
        date_creation: '2024-03-01T14:20:00',
        derniere_connexion: '2024-03-20T08:15:00',
        est_actif: true,
        id_superieur: 1,
        superieur: 'Amadou Diallo'
      },
      {
        id_utilisateur: 5,
        nom: 'Fall',
        prenom: 'Ibrahima',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        email: 'ibrahima.fall@fid.sn',
        mot_de_passe_hash: 'hashed_password',
        role: 'agent',
        telephone: '+221 77 567 89 01',
        region: 'Thiès',
        date_creation: '2024-02-15T16:45:00',
        derniere_connexion: '2024-03-18T12:30:00',
        est_actif: false,
        id_superieur: 2,
        superieur: 'Fatou Ndiaye'
      },
      {
        id_utilisateur: 6,
        nom: 'Diop',
        prenom: 'Mariama',
        image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face',
        email: 'mariama.diop@fid.sn',
        mot_de_passe_hash: 'hashed_password',
        role: 'agent',
        telephone: '+221 76 678 90 12',
        region: 'Kaolack',
        date_creation: '2024-01-10T10:00:00',
        derniere_connexion: '2024-03-20T09:45:00',
        est_actif: true,
        id_superieur: 2,
        superieur: 'Fatou Ndiaye'
      },
      {
        id_utilisateur: 7,
        nom: 'Ba',
        prenom: 'Oumar',
        image: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
        email: 'oumar.ba@fid.sn',
        mot_de_passe_hash: 'hashed_password',
        role: 'responsable',
        telephone: '+221 70 789 01 23',
        region: 'Ziguinchor',
        date_creation: '2024-02-28T13:15:00',
        derniere_connexion: '2024-03-19T17:20:00',
        est_actif: true,
        id_superieur: 1,
        superieur: 'Amadou Diallo'
      },
      {
        id_utilisateur: 8,
        nom: 'Gueye',
        prenom: 'Rokhaya',
        image: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=150&h=150&fit=crop&crop=face',
        email: 'rokhaya.gueye@fid.sn',
        mot_de_passe_hash: 'hashed_password',
        role: 'agent',
        telephone: '+221 77 890 12 34',
        region: 'Dakar',
        date_creation: '2024-03-05T15:30:00',
        derniere_connexion: null,
        est_actif: true,
        id_superieur: 7,
        superieur: 'Oumar Ba'
      }
    ];

    setUtilisateurs(mockUtilisateurs);
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

  // Filtrage des utilisateurs
  const utilisateursFiltres = utilisateurs.filter(utilisateur => {
    const matchesRecherche = 
      utilisateur.nom.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      utilisateur.prenom.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      utilisateur.email.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      `${utilisateur.prenom} ${utilisateur.nom}`.toLowerCase().includes(filtres.recherche.toLowerCase());

    const matchesRole = filtres.role === 'all' || utilisateur.role === filtres.role;
    const matchesRegion = filtres.region === 'all' || utilisateur.region === filtres.region;
    const matchesStatut = filtres.statut === 'all' || 
      (filtres.statut === 'actif' && utilisateur.est_actif) ||
      (filtres.statut === 'inactif' && !utilisateur.est_actif);

    // Filtre par onglet actif
    const matchesTab = activeTab === 'tous' || 
      (activeTab === 'actifs' && utilisateur.est_actif) ||
      (activeTab === 'inactifs' && !utilisateur.est_actif) ||
      (activeTab === 'admins' && utilisateur.role === 'admin') ||
      (activeTab === 'responsables' && utilisateur.role === 'responsable') ||
      (activeTab === 'agents' && utilisateur.role === 'agent');

    return matchesRecherche && matchesRole && matchesRegion && matchesStatut && matchesTab;
  });

  // Options pour les filtres
  const roles = ['admin', 'responsable', 'agent', 'decideur'];
  const regions = [...new Set(utilisateurs.map(u => u.region))];
  const statuts = ['actif', 'inactif'];

  // Navigation
  const handleVoirDetails = (utilisateur: Utilisateur): void => {
    navigate(`/utilisateur/${utilisateur.id_utilisateur}`);
  };

  const handleModifier = (utilisateur: Utilisateur): void => {
    navigate(`/modifier-utilisateur/${utilisateur.id_utilisateur}`, {
      state: { utilisateur }
    });
  };

  const handleToggleActif = (utilisateur: Utilisateur): void => {
    setUtilisateurs(prev => prev.map(u => 
      u.id_utilisateur === utilisateur.id_utilisateur 
        ? { ...u, est_actif: !u.est_actif }
        : u
    ));
  };

  const handleReinitialiserMotDePasse = (utilisateur: Utilisateur): void => {
    // Implémentez la logique de réinitialisation du mot de passe
    console.log('Réinitialiser mot de passe pour:', utilisateur.email);
  };

  // Formatage de la date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Jamais connecté';
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  // Formatage du rôle
  const formatRole = (role: string): string => {
    const roles: { [key: string]: string } = {
      'admin': 'Administrateur',
      'responsable': 'Responsable',
      'agent': 'Agent',
      'decideur': 'Décideur'
    };
    return roles[role] || role;
  };

  // Statistiques globales
  const statistiques = {
    total: utilisateurs.length,
    actifs: utilisateurs.filter(u => u.est_actif).length,
    inactifs: utilisateurs.filter(u => !u.est_actif).length,
    admins: utilisateurs.filter(u => u.role === 'admin').length,
    responsables: utilisateurs.filter(u => u.role === 'responsable').length,
    agents: utilisateurs.filter(u => u.role === 'agent').length,
    decideurs: utilisateurs.filter(u => u.role === 'decideur').length
  };

  if (loading) {
    return (
      <div className="utilisateurs-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des utilisateurs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="utilisateurs-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <h5 className="mb-0">Gestion des Utilisateurs</h5>
            <p className="mb-0 subtitle">Administration et gestion des accès</p>
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
                label="Utilisateurs"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Statistiques */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon total">
              <IoPersonOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.total}</span>
              <span className="stat-label">Total utilisateurs</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon actifs">
              <IoCheckmarkCircleOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.actifs}</span>
              <span className="stat-label">Utilisateurs actifs</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon admins">
              <IoBusinessOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.admins}</span>
              <span className="stat-label">Administrateurs</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon responsables">
              <IoPersonOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.responsables}</span>
              <span className="stat-label">Responsables</span>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'tous' ? 'active' : ''}`}
            onClick={() => setActiveTab('tous')}
          >
            Tous les utilisateurs
          </button>
          <button 
            className={`tab-button ${activeTab === 'actifs' ? 'active' : ''}`}
            onClick={() => setActiveTab('actifs')}
          >
            Utilisateurs actifs
          </button>
          <button 
            className={`tab-button ${activeTab === 'inactifs' ? 'active' : ''}`}
            onClick={() => setActiveTab('inactifs')}
          >
            Utilisateurs inactifs
          </button>
          <button 
            className={`tab-button ${activeTab === 'admins' ? 'active' : ''}`}
            onClick={() => setActiveTab('admins')}
          >
            Administrateurs
          </button>
          <button 
            className={`tab-button ${activeTab === 'responsables' ? 'active' : ''}`}
            onClick={() => setActiveTab('responsables')}
          >
            Responsables
          </button>
          <button 
            className={`tab-button ${activeTab === 'agents' ? 'active' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            Agents
          </button>
        </div>

        {/* Recherche et Filtres */}
        <div className="bgColor2 card shadow border-0 p-3 mt-4">
          <div className="utilisateurs-actions">
            <div className="search-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  name="recherche"
                  placeholder="Rechercher un utilisateur..."
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
                    name="role"
                    value={filtres.role}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Tous les rôles</option>
                    {roles.map(role => (
                      <option key={role} value={role}>
                        {formatRole(role)}
                      </option>
                    ))}
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

                <div className="filter-group">
                  <select 
                    name="statut"
                    value={filtres.statut}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Tous statuts</option>
                    {statuts.map(statut => (
                      <option key={statut} value={statut}>
                        {statut.charAt(0).toUpperCase() + statut.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="action-buttons">
                  <a href="/frmUtilisateurs">
                    <button className="btn-add-utilisateur">
                      <IoAddOutline />
                      Nouvel Utilisateur
                    </button>
                  </a>
                  <button className="btn-action secondary">
                    <IoRefreshOutline />
                    Actualiser
                  </button>
                  <button className="btn-action secondary">
                    <IoDownloadOutline />
                    Exporter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des Utilisateurs */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="utilisateurs-list">
            {utilisateursFiltres.length > 0 ? (
              utilisateursFiltres.map(utilisateur => (
                <div key={utilisateur.id_utilisateur} className="bgColor2 utilisateur-card">
                  <div className="utilisateur-header">
                    <div className="utilisateur-main-info">
                      <div className="utilisateur-avatar">
                        {utilisateur.image ? (
                          <img src={utilisateur.image} alt={`${utilisateur.prenom} ${utilisateur.nom}`} />
                        ) : (
                          <div className="avatar-placeholder">
                            {utilisateur.prenom.charAt(0)}{utilisateur.nom.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="utilisateur-title-section">
                        <div className="title-row">
                          <h4 className="utilisateur-title">{utilisateur.prenom} {utilisateur.nom}</h4>
                          <div className="status-badges">
                            <span className={`badge role ${utilisateur.role}`}>
                              {formatRole(utilisateur.role)}
                            </span>
                            
                            <span className={`badge statut ${utilisateur.est_actif ? 'actif' : 'inactif'}`}>
                              {utilisateur.est_actif ? (
                                <>
                                  <IoCheckmarkCircleOutline />
                                  Actif
                                </>
                              ) : (
                                <>
                                  <IoCloseCircleOutline />
                                  Inactif
                                </>
                              )}
                            </span>

                            <span className="badge region">
                              <IoLocationOutline />
                              {utilisateur.region}
                            </span>
                          </div>
                        </div>
                        
                        <div className="utilisateur-meta">
                          <span className="email">
                            <IoMailOutline />
                            {utilisateur.email}
                          </span>
                          
                          <span className="telephone">
                            <IoCallOutline />
                            {utilisateur.telephone}
                          </span>

                          <span className="date-creation">
                            <IoCalendarOutline />
                            Inscrit le {formatDate(utilisateur.date_creation)}
                          </span>

                          {utilisateur.superieur && (
                            <span className="superieur">
                              <IoPersonOutline />
                              Supérieur: {utilisateur.superieur}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="utilisateur-actions">
                      <button 
                        className="btn-action primary"
                        onClick={() => handleVoirDetails(utilisateur)}
                        title="Voir les détails"
                      >
                        <IoEyeOutline />
                        Détails
                      </button>
                      
                      <button 
                        className="btn-action secondary"
                        onClick={() => handleModifier(utilisateur)}
                        title="Modifier"
                      >
                        <IoPencilOutline />
                        Modifier
                      </button>

                      <button 
                        className={`btn-action ${utilisateur.est_actif ? 'warning' : 'success'}`}
                        onClick={() => handleToggleActif(utilisateur)}
                        title={utilisateur.est_actif ? 'Désactiver' : 'Activer'}
                      >
                        {utilisateur.est_actif ? <IoCloseCircleOutline /> : <IoCheckmarkCircleOutline />}
                        {utilisateur.est_actif ? 'Désactiver' : 'Activer'}
                      </button>

                      <button 
                        className="btn-action danger"
                        title="Supprimer"
                      >
                        <IoTrashOutline />
                        Supprimer
                      </button>
                    </div>
                  </div>

                  {/* Dernière connexion */}
                  <div className="utilisateur-footer">
                    <div className="derniere-connexion">
                      <span className="label">Dernière connexion:</span>
                      <span className="value">{formatDate(utilisateur.derniere_connexion)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">👥</div>
                <p>Aucun utilisateur trouvé</p>
                <small>Essayez de modifier vos critères de recherche ou de filtre</small>
              </div>
            )}
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

export default Utilisateurs;