import React, { useState, useEffect, ChangeEvent } from 'react';
import './Notifications.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoSearchOutline,
  IoFilterOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoTimeOutline,
  IoNotificationsOutline,
  IoEllipsisVertical,
  IoEyeOutline,
  IoTrashOutline,
  IoArchiveOutline,
  IoReloadOutline,
  IoCheckmarkOutline,
  IoCloseOutline
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
interface Notification {
  id_notification: number;
  type_notification: 'alerte' | 'rappel' | 'validation' | 'systeme' | 'information';
  titre: string;
  message: string;
  date_creation: string;
  est_lue: boolean;
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  lien_action?: string;
  id_objet_concerne?: number;
  type_objet_concerne?: string;
}

interface Filtres {
  recherche: string;
  type_notification: string;
  priorite: string;
  est_lue: string;
  date_debut: string;
  date_fin: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filtres, setFiltres] = useState<Filtres>({
    recherche: '',
    type_notification: 'all',
    priorite: 'all',
    est_lue: 'all',
    date_debut: '',
    date_fin: ''
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  // Données mock basées sur votre structure
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id_notification: 1,
        type_notification: 'alerte',
        titre: 'Dépassement de budget détecté',
        message: 'Le projet "Construction École Primaire" a dépassé son budget initial de 15%. Une révision est nécessaire.',
        date_creation: '2024-01-15T10:30:00',
        est_lue: false,
        priorite: 'haute',
        lien_action: '/projets/1',
        id_objet_concerne: 1,
        type_objet_concerne: 'projet'
      },
      {
        id_notification: 2,
        type_notification: 'rappel',
        titre: 'Échéance approchante',
        message: 'La date limite pour le rapport trimestriel est dans 3 jours. Pensez à le finaliser.',
        date_creation: '2024-01-14T14:20:00',
        est_lue: true,
        priorite: 'normale',
        lien_action: '/rapports',
        id_objet_concerne: 2,
        type_objet_concerne: 'rapport'
      },
      {
        id_notification: 3,
        type_notification: 'validation',
        titre: 'Demande de validation',
        message: 'Une nouvelle demande de paiement de 12,500€ attend votre validation.',
        date_creation: '2024-01-14T09:15:00',
        est_lue: false,
        priorite: 'urgente',
        lien_action: '/validations',
        id_objet_concerne: 3,
        type_objet_concerne: 'paiement'
      },
      {
        id_notification: 4,
        type_notification: 'systeme',
        titre: 'Mise à jour système',
        message: 'Une mise à jour de sécurité importante sera appliquée ce soir à 22h00. Le système sera indisponible pendant 30 minutes.',
        date_creation: '2024-01-13T16:45:00',
        est_lue: true,
        priorite: 'normale'
      },
      {
        id_notification: 5,
        type_notification: 'information',
        titre: 'Nouveau prestataire enregistré',
        message: 'Le prestataire "Tech Solutions SARL" a été ajouté avec succès à la plateforme.',
        date_creation: '2024-01-13T11:20:00',
        est_lue: true,
        priorite: 'basse',
        lien_action: '/prestataires/5',
        id_objet_concerne: 5,
        type_objet_concerne: 'prestataire'
      },
      {
        id_notification: 6,
        type_notification: 'alerte',
        titre: 'Retard de livraison',
        message: 'Le projet "Infrastructure Routière" accuse un retard de 8 jours sur le planning initial.',
        date_creation: '2024-01-12T08:30:00',
        est_lue: false,
        priorite: 'haute',
        lien_action: '/projets/3',
        id_objet_concerne: 3,
        type_objet_concerne: 'projet'
      }
    ];

    setNotifications(mockNotifications);
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

  // Filtrage des notifications
  const notificationsFiltrees = notifications.filter(notification => {
    const matchesRecherche = 
      notification.titre.toLowerCase().includes(filtres.recherche.toLowerCase()) ||
      notification.message.toLowerCase().includes(filtres.recherche.toLowerCase());

    const matchesType = filtres.type_notification === 'all' || notification.type_notification === filtres.type_notification;
    const matchesPriorite = filtres.priorite === 'all' || notification.priorite === filtres.priorite;
    const matchesLue = filtres.est_lue === 'all' || 
      (filtres.est_lue === 'true' && notification.est_lue) ||
      (filtres.est_lue === 'false' && !notification.est_lue);

    // Filtrage par date
    let matchesDate = true;
    if (filtres.date_debut) {
      const dateCreation = new Date(notification.date_creation);
      const dateDebut = new Date(filtres.date_debut);
      matchesDate = matchesDate && dateCreation >= dateDebut;
    }
    if (filtres.date_fin) {
      const dateCreation = new Date(notification.date_creation);
      const dateFin = new Date(filtres.date_fin);
      dateFin.setHours(23, 59, 59, 999); // Fin de journée
      matchesDate = matchesDate && dateCreation <= dateFin;
    }

    return matchesRecherche && matchesType && matchesPriorite && matchesLue && matchesDate;
  });

  // Options pour les filtres
  const typesNotification = ['alerte', 'rappel', 'validation', 'systeme', 'information'];
  const priorities = ['basse', 'normale', 'haute', 'urgente'];

  // Marquer comme lue/non lue
  const toggleLu = (id: number): void => {
    setNotifications(prev => prev.map(notif => 
      notif.id_notification === id ? { ...notif, est_lue: !notif.est_lue } : notif
    ));
  };

  // Marquer toutes comme lues
  const marquerToutesCommeLues = (): void => {
    setNotifications(prev => prev.map(notif => ({ ...notif, est_lue: true })));
    setSelectedNotifications([]);
  };

  // Suppression d'une notification
  const handleSupprimerClick = (notification: Notification): void => {
    setNotificationToDelete(notification);
    setShowDeleteModal(true);
  };

  const confirmSuppression = (): void => {
    if (notificationToDelete) {
      setNotifications(prev => prev.filter(n => n.id_notification !== notificationToDelete.id_notification));
      setShowDeleteModal(false);
      setNotificationToDelete(null);
    }
  };

  const annulerSuppression = (): void => {
    setShowDeleteModal(false);
    setNotificationToDelete(null);
  };

  // Supprimer plusieurs notifications
  const supprimerSelection = (): void => {
    setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id_notification)));
    setSelectedNotifications([]);
  };

  // Sélection/désélection
  const toggleSelection = (id: number): void => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // Sélectionner toutes les notifications
  const toggleSelectAll = (): void => {
    if (selectedNotifications.length === notificationsFiltrees.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notificationsFiltrees.map(n => n.id_notification));
    }
  };

  // Formatage de la date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} j`;
    
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Obtenir l'icône selon le type
  const getTypeIcon = (type: string): JSX.Element => {
    switch (type) {
      case 'alerte':
        return <IoWarningOutline className="icon-alerte" />;
      case 'rappel':
        return <IoTimeOutline className="icon-rappel" />;
      case 'validation':
        return <IoCheckmarkCircleOutline className="icon-validation" />;
      case 'systeme':
        return <IoInformationCircleOutline className="icon-systeme" />;
      default:
        return <IoInformationCircleOutline className="icon-information" />;
    }
  };

  // Obtenir la classe CSS selon la priorité
  const getPriorityClass = (priorite: string): string => {
    return `priority-${priorite}`;
  };

  // Obtenir la classe CSS selon le type
  const getTypeClass = (type: string): string => {
    return `type-${type}`;
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des notifications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <h5 className="mb-0">Gestion des Notifications</h5>
            <p className="mb-0 subtitle">Suivi et gestion de toutes vos alertes et messages</p>
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
                label="Notifications"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Statistiques */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon total">
              <IoNotificationsOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{notifications.length}</span>
              <span className="stat-label">Total notifications</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon unread">
              <IoWarningOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">
                {notifications.filter(n => !n.est_lue).length}
              </span>
              <span className="stat-label">Non lues</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon alert">
              <IoWarningOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">
                {notifications.filter(n => n.type_notification === 'alerte').length}
              </span>
              <span className="stat-label">Alertes</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon urgent">
              <IoWarningOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">
                {notifications.filter(n => n.priorite === 'urgente').length}
              </span>
              <span className="stat-label">Urgentes</span>
            </div>
          </div>
        </div>

        {/* Actions globales */}
        {selectedNotifications.length > 0 && (
          <div className="bulk-actions-card">
            <div className="bulk-actions">
              <span className="selected-count">
                {selectedNotifications.length} notification(s) sélectionnée(s)
              </span>
              <div className="bulk-buttons">
                <button 
                  className="btn-bulk mark-read"
                  onClick={marquerToutesCommeLues}
                >
                  <IoCheckmarkOutline />
                  Marquer comme lues
                </button>
                <button 
                  className="btn-bulk delete"
                  onClick={supprimerSelection}
                >
                  <IoTrashOutline />
                  Supprimer
                </button>
                <button 
                  className="btn-bulk cancel"
                  onClick={() => setSelectedNotifications([])}
                >
                  <IoCloseOutline />
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recherche et Filtres */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="notifications-actions">
            <div className="search-container">
              <div className="search-box">
                <IoSearchOutline className="search-icon" />
                <input
                  type="text"
                  name="recherche"
                  placeholder="Rechercher une notification..."
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
                    name="type_notification"
                    value={filtres.type_notification}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Tous les types</option>
                    {typesNotification.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="priorite"
                    value={filtres.priorite}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Toutes priorités</option>
                    {priorities.map(priorite => (
                      <option key={priorite} value={priorite}>
                        {priorite.charAt(0).toUpperCase() + priorite.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="filter-group">
                  <select 
                    name="est_lue"
                    value={filtres.est_lue}
                    onChange={handleFiltreChange}
                  >
                    <option value="all">Tous statuts</option>
                    <option value="false">Non lues</option>
                    <option value="true">Lues</option>
                  </select>
                </div>

                <div className="filter-group date-group">
                  <input
                    type="date"
                    name="date_debut"
                    placeholder="Date début"
                    value={filtres.date_debut}
                    onChange={handleFiltreChange}
                  />
                </div>

                <div className="filter-group date-group">
                  <input
                    type="date"
                    name="date_fin"
                    placeholder="Date fin"
                    value={filtres.date_fin}
                    onChange={handleFiltreChange}
                  />
                </div>

                <button 
                  className="btn-action primary"
                  onClick={marquerToutesCommeLues}
                >
                  <IoCheckmarkOutline />
                  Tout marquer lu
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des Notifications */}
        <div className="bgColor card shadow border-0 p-3 mt-4">
          <div className="notifications-header">
            <div className="select-all">
              <input
                type="checkbox"
                checked={selectedNotifications.length > 0 && selectedNotifications.length === notificationsFiltrees.length}
                onChange={toggleSelectAll}
                className="checkbox"
              />
              <span>Tout sélectionner</span>
            </div>
            <div className="notifications-count">
              {notificationsFiltrees.length} notification(s)
            </div>
          </div>

          <div className="notifications-list">
            {notificationsFiltrees.length > 0 ? (
              notificationsFiltrees.map(notification => (
                <div 
                  key={notification.id_notification} 
                  className={`notification-card ${!notification.est_lue ? 'unread' : ''} ${getPriorityClass(notification.priorite)}`}
                >
                  <div className="notification-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id_notification)}
                      onChange={() => toggleSelection(notification.id_notification)}
                      className="checkbox"
                    />
                  </div>

                  <div className="notification-icon">
                    {getTypeIcon(notification.type_notification)}
                  </div>

                  <div className="notification-content">
                    <div className="notification-header">
                      <h4 className="notification-title">{notification.titre}</h4>
                      <div className="notification-meta">
                        <span className={`badge type ${getTypeClass(notification.type_notification)}`}>
                          {notification.type_notification}
                        </span>
                        <span className={`badge priority ${getPriorityClass(notification.priorite)}`}>
                          {notification.priorite}
                        </span>
                        <span className="notification-time">
                          {formatDate(notification.date_creation)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="notification-message">{notification.message}</p>
                    
                    {notification.lien_action && (
                      <div className="notification-actions">
                        <a href={notification.lien_action} className="btn-action-link">
                          Voir les détails
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="notification-actions-menu">
                    <div className="dropdown">
                      <div className="dropdown-menu">
                        <button 
                          className="dropdown-item"
                          onClick={() => toggleLu(notification.id_notification)}
                        >
                          <IoEyeOutline />
                          {notification.est_lue ? 'Marquer non lue' : 'Marquer comme lue'}
                        </button>
                        <button 
                          className="dropdown-item danger"
                          onClick={() => handleSupprimerClick(notification)}
                        >
                          <IoTrashOutline />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>

                  {!notification.est_lue && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔔</div>
                <p>Aucune notification trouvée</p>
                <small>Essayez de modifier vos critères de recherche</small>
              </div>
            )}
          </div>
        </div>

        {/* Modal de confirmation de suppression */}
        {showDeleteModal && notificationToDelete && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Confirmer la suppression</h3>
              </div>
              <div className="modal-body">
                <p>
                  Êtes-vous sûr de vouloir supprimer la notification <strong>"{notificationToDelete.titre}"</strong> ?
                </p>
                <p className="warning-text">
                  Cette action est irréversible.
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

export default Notifications;