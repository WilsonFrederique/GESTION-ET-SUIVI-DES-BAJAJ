import React, { useState } from 'react';
import './Administrations.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IoSearchOutline, IoMenuOutline } from "react-icons/io5";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaEye, 
  FaEdit, 
  FaPlus, 
  FaUserTie, 
  FaClipboardCheck, 
  FaBalanceScale, 
  FaExclamationTriangle, 
  FaArrowUp
} from "react-icons/fa";
import { MdPendingActions, MdSupervisedUserCircle } from "react-icons/md";
import { BsThreeDotsVertical, BsGraphUpArrow } from "react-icons/bs";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { 
  Chip, 
  emphasize, 
  styled, 
  Modal, 
  Box, 
  Tooltip, 
  LinearProgress,
  Menu,
  MenuItem,
  IconButton
} from '@mui/material';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        "&:hover, &:focus": { backgroundColor: emphasize(backgroundColor, 0.06) },
        "&:active": { boxShadow: theme.shadows[1], backgroundColor: emphasize(backgroundColor, 0.12) },
    };
}) as typeof Chip;

// Types
interface Strategy { 
  id: number; 
  titre: string; 
  description: string; 
  statut: 'en_attente' | 'approuve' | 'rejete'; 
  priorite: 'haute' | 'moyenne' | 'basse'; 
  dateCreation: string; 
  montantImpact: number; 
  soumispar: string; 
}

interface Budget { 
  id: number; 
  designation: string; 
  montantDemande: number; 
  montantApprouve: number; 
  statut: 'en_attente' | 'approuve' | 'rejete' | 'revision'; 
  departement: string; 
  dateSoumission: string; 
  justification: string; 
}

interface SupervisionItem { 
  id: number; 
  action: string; 
  responsable: string; 
  dateAction: string; 
  statut: 'complete' | 'en_cours' | 'retard'; 
  commentaire: string; 
}

const Administrations: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'strategies' | 'budgets' | 'supervision'>('strategies');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('tous');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
    const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedActionItem, setSelectedActionItem] = useState<any>(null);

    // Données Stratégies basées sur le Business Plan
    const strategies: Strategy[] = [
        { id: 1, titre: "Expansion Flotte Q2 2026", description: "Acquisition de 4 nouveaux Tuc Tuc électriques pour septembre 2026", statut: 'en_attente', priorite: 'haute', dateCreation: "2025-11-15", montantImpact: 15280.90, soumispar: "DG Barry" },
        { id: 2, titre: "Optimisation Charges Mensuelles", description: "Réduction forfait garage de 100,000 MGA à 80,000 MGA", statut: 'approuve', priorite: 'moyenne', dateCreation: "2025-11-10", montantImpact: 240, soumispar: "Direction Financière" },
        { id: 3, titre: "Nouveau Partenariat Parking", description: "Négociation tarif parking & charge à 120,000 MGA/mois", statut: 'en_attente', priorite: 'moyenne', dateCreation: "2025-11-18", montantImpact: 360, soumispar: "DG Barry" },
        { id: 4, titre: "Programme Prime Gérant", description: "Augmentation prime gérant de 5% à 7% pour motivation", statut: 'rejete', priorite: 'basse', dateCreation: "2025-11-05", montantImpact: 480, soumispar: "RH" },
        { id: 5, titre: "Crédit Bancaire Expansion", description: "Demande crédit 110,000,000 MGA taux 15% sur 12 mois", statut: 'approuve', priorite: 'haute', dateCreation: "2025-10-20", montantImpact: 28426.97, soumispar: "Direction Financière" },
    ];

    // Données Budgets basées sur le Business Plan
    const budgets: Budget[] = [
        { id: 1, designation: "Acquisition Tuc Tuc (x2)", montantDemande: 34000000, montantApprouve: 34000000, statut: 'approuve', departement: "Flotte", dateSoumission: "2025-11-01", justification: "Expansion flotte prévue avril 2026" },
        { id: 2, designation: "Charges Annuelles 2026", montantDemande: 1262000, montantApprouve: 1200000, statut: 'revision', departement: "Opérations", dateSoumission: "2025-11-10", justification: "Licence, visite technique, assurance, patente, mutation" },
        { id: 3, designation: "Pièces de Rechange Q1", montantDemande: 195000, montantApprouve: 0, statut: 'en_attente', departement: "Maintenance", dateSoumission: "2025-11-15", justification: "Stock pièces consommables 3 mois" },
        { id: 4, designation: "Prime Gérant Annuelle", montantDemande: 1029600, montantApprouve: 1029600, statut: 'approuve', departement: "RH", dateSoumission: "2025-10-25", justification: "5% recette mensuelle x 12 mois" },
        { id: 5, designation: "Remboursement Crédit", montantDemande: 126500000, montantApprouve: 126500000, statut: 'approuve', departement: "Finance", dateSoumission: "2025-10-15", justification: "Crédit + intérêts 15% sur 12 mois" },
    ];

    // Données Supervision DG
    const supervisions: SupervisionItem[] = [
        { id: 1, action: "Validation rapport mensuel novembre", responsable: "PDG", dateAction: "2025-11-20", statut: 'complete', commentaire: "Recettes conformes aux prévisions" },
        { id: 2, action: "Revue performance flotte", responsable: "DG Barry", dateAction: "2025-11-22", statut: 'en_cours', commentaire: "Analyse ROI par véhicule en cours" },
        { id: 3, action: "Approbation nouvelles acquisitions", responsable: "PDG", dateAction: "2025-11-25", statut: 'en_cours', commentaire: "En attente validation stratégie Q2" },
        { id: 4, action: "Audit charges mensuelles", responsable: "DG Barry", dateAction: "2025-11-18", statut: 'retard', commentaire: "Retard 2 jours - justification requise" },
        { id: 5, action: "Négociation taux crédit", responsable: "Direction Financière", dateAction: "2025-11-30", statut: 'en_cours', commentaire: "Objectif: réduction à 13%" },
    ];

    const formatMGA = (val: number) => new Intl.NumberFormat('fr-MG').format(val) + ' MGA';
    const formatUSD = (val: number) => '$' + new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(val / 4450);

    const getStatusBadge = (statut: string) => {
        const configs: Record<string, { class: string; icon: JSX.Element; label: string }> = {
            'en_attente': { class: 'status-pending', icon: <FaClock />, label: 'En attente' },
            'approuve': { class: 'status-approved', icon: <FaCheckCircle />, label: 'Approuvé' },
            'rejete': { class: 'status-rejected', icon: <FaTimesCircle />, label: 'Rejeté' },
            'revision': { class: 'status-revision', icon: <MdPendingActions />, label: 'En révision' },
            'complete': { class: 'status-approved', icon: <FaCheckCircle />, label: 'Complété' },
            'en_cours': { class: 'status-pending', icon: <FaClock />, label: 'En cours' },
            'retard': { class: 'status-rejected', icon: <FaExclamationTriangle />, label: 'En retard' },
        };
        const cfg = configs[statut] || configs['en_attente'];
        return <span className={`admin-status-badge ${cfg.class}`}>{cfg.icon} <span className="status-label">{cfg.label}</span></span>;
    };

    const getPriorityBadge = (priorite: string) => {
        const configs: Record<string, string> = { 'haute': 'priority-high', 'moyenne': 'priority-medium', 'basse': 'priority-low' };
        return <span className={`admin-priority-badge ${configs[priorite]}`}>{priorite.charAt(0).toUpperCase() + priorite.slice(1)}</span>;
    };

    // Stats
    const statsStrategies = { 
        total: strategies.length, 
        approuvees: strategies.filter(s => s.statut === 'approuve').length, 
        enAttente: strategies.filter(s => s.statut === 'en_attente').length, 
        rejetees: strategies.filter(s => s.statut === 'rejete').length 
    };
    
    const statsBudgets = { 
        totalDemande: budgets.reduce((a, b) => a + b.montantDemande, 0), 
        totalApprouve: budgets.reduce((a, b) => a + b.montantApprouve, 0), 
        tauxApprobation: Math.round((budgets.filter(b => b.statut === 'approuve').length / budgets.length) * 100) 
    };
    
    const statsSupervision = { 
        total: supervisions.length, 
        completes: supervisions.filter(s => s.statut === 'complete').length, 
        enRetard: supervisions.filter(s => s.statut === 'retard').length 
    };

    const handleAction = (action: string, item: any) => { 
        setSelectedItem(item); 
        setModalOpen(true); 
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
    };

    const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, item: any) => {
        setSelectedActionItem(item);
        setActionMenuAnchor(event.currentTarget);
    };

    const handleActionMenuClose = () => {
        setActionMenuAnchor(null);
        setSelectedActionItem(null);
    };

    const filteredStrategies = strategies.filter(s => 
        (filterStatus === 'tous' || s.statut === filterStatus) && 
        (s.titre.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const filteredBudgets = budgets.filter(b => 
        (filterStatus === 'tous' || b.statut === filterStatus) && 
        (b.designation.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const filteredSupervisions = supervisions.filter(s => 
        (filterStatus === 'tous' || s.statut === filterStatus) && 
        (s.action.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="admin-container">
            <div className="right-content w-100">
                {/* Header avec Breadcrumbs */}
                <div className="administration-header">
                <div className="header-content">
                    <div className="header-text">
                    <div className="header-title-content">
                        <h1 className="dashboard-title">
                        Aperçu de l’<span className="highlight">Administration</span>
                        </h1>
                        <p className="dashboard-subtitle">
                        Gestion et analyse complète des activités administratives de votre entreprise
                        </p>
                    </div>
                    </div>
                    <div className="header-actions">
                    <button className="header-action-btn">
                        <IoMenuOutline />
                    </button>
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

                {/* Mobile Menu */}
                <Menu
                    anchorEl={mobileMenuAnchor}
                    open={Boolean(mobileMenuAnchor)}
                    onClose={handleMobileMenuClose}
                    className="admin-mobile-menu"
                >
                    <MenuItem onClick={() => { setActiveTab('strategies'); handleMobileMenuClose(); }}>
                        <FaClipboardCheck /> Stratégies
                    </MenuItem>
                    <MenuItem onClick={() => { setActiveTab('budgets'); handleMobileMenuClose(); }}>
                        <FaBalanceScale /> Budgets
                    </MenuItem>
                    <MenuItem onClick={() => { setActiveTab('supervision'); handleMobileMenuClose(); }}>
                        <MdSupervisedUserCircle /> Supervision
                    </MenuItem>
                </Menu>

                {/* Stats Overview */}
                <div className="admin-stats-grid">
                    <div className="admin-stat-card stat-strategies">
                        <div className="stat-content">
                            <span className="stat-label">Stratégies</span>
                            <span className="stat-value">{statsStrategies.total}</span>
                            <span className="stat-detail"><FaCheckCircle className="text-success" /> {statsStrategies.approuvees} approuvées</span>
                        </div>
                    </div>
                    <div className="admin-stat-card stat-budgets">
                        <div className="stat-content">
                            <span className="stat-label">Budget Total</span>
                            <span className="stat-value">{formatMGA(statsBudgets.totalApprouve)}</span> 
                            <span className="stat-detail"><BsGraphUpArrow /> {statsBudgets.tauxApprobation}% approuvé</span>
                        </div>
                    </div>
                    <div className="admin-stat-card stat-supervision">
                        <div className="stat-content">
                            <span className="stat-label">Actions DG</span>
                            <span className="stat-value">{statsSupervision.total}</span>
                            <span className="stat-detail">
                                {statsSupervision.enRetard > 0 && <><FaExclamationTriangle className="text-warning" /> {statsSupervision.enRetard} en retard</>}
                            </span>
                        </div>
                    </div>
                    <div className="admin-stat-card stat-roi">
                        <div className="stat-content">
                            <span className="stat-label">ROI Estimé</span>
                            <span className="stat-value">42%</span>
                            <span className="stat-detail"><FaArrowUp className="text-success" /> +5% vs prévu</span>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="admin-tabs-container">
                    <div className="admin-tabs">
                        <button 
                            className={`admin-tab ${activeTab === 'strategies' ? 'active' : ''}`} 
                            onClick={() => { setActiveTab('strategies'); setFilterStatus('tous'); }}
                        >
                            <FaClipboardCheck /> 
                            <span className="tab-label">Validation Stratégies</span>
                        </button>
                        <button 
                            className={`admin-tab ${activeTab === 'budgets' ? 'active' : ''}`} 
                            onClick={() => { setActiveTab('budgets'); setFilterStatus('tous'); }}
                        >
                            <FaBalanceScale /> 
                            <span className="tab-label">Approbation Budgets</span>
                        </button>
                        <button 
                            className={`admin-tab ${activeTab === 'supervision' ? 'active' : ''}`} 
                            onClick={() => { setActiveTab('supervision'); setFilterStatus('tous'); }}
                        >
                            <MdSupervisedUserCircle /> 
                            <span className="tab-label">Supervision DG</span>
                        </button>
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="card shadow border-0 p-3 mt-3 admin-search-card">
                    <div className="admin-search-filter">
                        <div className="admin-search-box">
                            <IoSearchOutline className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Rechercher..." 
                                value={searchTerm} 
                                onChange={(e) => setSearchTerm(e.target.value)} 
                            />
                        </div>
                        <div className="admin-filter-group">
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="tous">Tous les statuts</option>
                                <option value="en_attente">En attente</option>
                                <option value="approuve">Approuvé</option>
                                <option value="rejete">Rejeté</option>
                                {activeTab === 'budgets' && <option value="revision">En révision</option>}
                                {activeTab === 'supervision' && (
                                    <>
                                        <option value="complete">Complété</option>
                                        <option value="en_cours">En cours</option>
                                        <option value="retard">En retard</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <button className="admin-btn-add">
                            <FaPlus /> 
                            <span className="btn-add-label">Nouveau</span>
                        </button>
                    </div>
                </div>

                {/* Content Based on Tab */}
                <div className="admin-content-area">
                    {/* STRATEGIES TAB */}
                    {activeTab === 'strategies' && (
                        <div className="admin-table-container">
                            <div className="admin-table-header">
                                <h6><FaClipboardCheck /> Stratégies en attente de validation ({filteredStrategies.length})</h6>
                            </div>
                            <div className="admin-table-responsive">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th className="col-strategy">Stratégie</th>
                                            <th className="col-impact">Impact Financier</th>
                                            <th className="col-submitted">Soumis par</th>
                                            <th className="col-date">Date</th>
                                            <th className="col-status">Statut</th>
                                            <th className="col-actions">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredStrategies.map((s) => (
                                            <tr key={s.id} className={s.statut === 'en_attente' ? 'row-highlight' : ''}>
                                                <td className="col-strategy">
                                                    <div className="item-info">
                                                        <strong>{s.titre}</strong>
                                                        <small>{s.description}</small>
                                                    </div>
                                                </td>
                                                <td className="col-impact">
                                                    <div className="amount-cell">
                                                        <span className="amount-mga">{formatUSD(s.montantImpact * 4450)}</span>
                                                    </div>
                                                </td>
                                                <td className="dark col-submitted">{s.soumispar}</td>
                                                <td className="dark col-date">{new Date(s.dateCreation).toLocaleDateString('fr-FR')}</td>
                                                <td className="col-status">{getStatusBadge(s.statut)}</td>
                                                <td className="col-actions">
                                                    <div className="action-buttons">
                                                        <Tooltip title="Voir détails">
                                                            <button className="btn-action btn-view" onClick={() => handleAction('view', s)}>
                                                                <FaEye />
                                                            </button>
                                                        </Tooltip>
                                                        {s.statut === 'en_attente' && (
                                                            <>
                                                                <Tooltip title="Approuver">
                                                                    <button className="btn-action btn-approve">
                                                                        <FaCheckCircle />
                                                                    </button>
                                                                </Tooltip>
                                                                <Tooltip title="Rejeter">
                                                                    <button className="btn-action btn-reject">
                                                                        <FaTimesCircle />
                                                                    </button>
                                                                </Tooltip>
                                                            </>
                                                        )}
                                                        {/* Mobile Action Menu */}
                                                        <div className="mobile-action-menu">
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={(e) => handleActionMenuOpen(e, s)}
                                                            >
                                                                <BsThreeDotsVertical />
                                                            </IconButton>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                
                                {/* Mobile Cards View for Strategies */}
                                <div className="admin-mobile-cards">
                                    {filteredStrategies.map((s) => (
                                        <div key={s.id} className={`admin-mobile-card ${s.statut === 'en_attente' ? 'row-highlight' : ''}`}>
                                            <div className="mobile-card-header">
                                                <h6>{s.titre}</h6>
                                                {getStatusBadge(s.statut)}
                                            </div>
                                            <div className="mobile-card-body">
                                                <div className="mobile-card-row">
                                                    <span>Description:</span>
                                                    <p>{s.description}</p>
                                                </div>
                                                <div className="mobile-card-row">
                                                    <span>Impact:</span>
                                                    <strong className="amount-mga">{formatUSD(s.montantImpact * 4450)}</strong>
                                                </div>
                                                <div className="mobile-card-row">
                                                    <span>Soumis par:</span>
                                                    <span>{s.soumispar}</span>
                                                </div>
                                                <div className="mobile-card-row">
                                                    <span>Date:</span>
                                                    <span>{new Date(s.dateCreation).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                            <div className="mobile-card-actions">
                                                <button className="btn-action btn-view" onClick={() => handleAction('view', s)}>
                                                    <FaEye /> Détails
                                                </button>
                                                {s.statut === 'en_attente' && (
                                                    <div className="action-group">
                                                        <button className="btn-action btn-approve">
                                                            <FaCheckCircle /> Approuver
                                                        </button>
                                                        <button className="btn-action btn-reject">
                                                            <FaTimesCircle /> Rejeter
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BUDGETS TAB */}
                    {activeTab === 'budgets' && (
                        <div className="admin-table-container">
                            <div className="admin-table-header">
                                <h6><FaBalanceScale /> Demandes de budget ({filteredBudgets.length})</h6>
                                <div className="budget-summary">
                                    <span>Total demandé: <strong>{formatMGA(statsBudgets.totalDemande)}</strong></span>
                                    <span>Total approuvé: <strong className="text-success">{formatMGA(statsBudgets.totalApprouve)}</strong></span>
                                </div>
                            </div>
                            <div className="admin-cards-grid">
                                {filteredBudgets.map((b) => (
                                    <div key={b.id} className={`admin-budget-card ${b.statut}`}>
                                        <div className="budget-card-header">
                                            <h6>{b.designation}</h6>
                                            {getStatusBadge(b.statut)}
                                        </div>
                                        <div className="budget-card-body">
                                            <div className="budget-amounts">
                                                <div className="amount-row">
                                                    <span>Demandé:</span>
                                                    <strong>{formatMGA(b.montantDemande)}</strong>
                                                </div>
                                                <div className="amount-row">
                                                    <span>Approuvé:</span>
                                                    <strong className={b.montantApprouve > 0 ? 'text-success' : ''}>
                                                        {formatMGA(b.montantApprouve)}
                                                    </strong>
                                                </div>
                                                <LinearProgress 
                                                    variant="determinate" 
                                                    value={(b.montantApprouve / b.montantDemande) * 100} 
                                                    className="budget-progress" 
                                                />
                                            </div>
                                            <div className="budget-meta">
                                                <span><strong>Département:</strong> {b.departement}</span>
                                                <span><strong>Date:</strong> {new Date(b.dateSoumission).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            <p className="budget-justification">{b.justification}</p>
                                        </div>
                                        <div className="budget-card-actions">
                                            <button className="btn-action btn-view">
                                                <FaEye /> <span>Détails</span>
                                            </button>
                                            {b.statut === 'en_attente' && (
                                                <div className="action-group">
                                                    <button className="btn-action btn-approve">
                                                        <FaCheckCircle /> <span>Approuver</span>
                                                    </button>
                                                    <button className="btn-action btn-reject">
                                                        <FaTimesCircle /> <span>Rejeter</span>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SUPERVISION TAB */}
                    {activeTab === 'supervision' && (
                        <div className="admin-table-container">
                            <div className="admin-table-header">
                                <h6><MdSupervisedUserCircle /> Suivi des actions DG ({filteredSupervisions.length})</h6>
                            </div>
                            <div className="admin-timeline">
                                {filteredSupervisions.map((s, idx) => (
                                    <div key={s.id} className={`timeline-item ${s.statut}`}>
                                        <div className="timeline-marker">
                                            {s.statut === 'complete' && <FaCheckCircle />}
                                            {s.statut === 'en_cours' && <FaClock />}
                                            {s.statut === 'retard' && <FaExclamationTriangle />}
                                        </div>
                                        <div className="timeline-content">
                                            <div className="timeline-header">
                                                <h6>{s.action}</h6>
                                                {getStatusBadge(s.statut)}
                                            </div>
                                            <div className="timeline-meta">
                                                <span><FaUserTie /> {s.responsable}</span>
                                                <span><FaClock /> {new Date(s.dateAction).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            <p className="timeline-comment">{s.commentaire}</p>
                                            <div className="timeline-actions">
                                                <button className="btn-action btn-view">
                                                    <FaEye /> <span>Voir</span>
                                                </button>
                                                <button className="btn-action btn-edit">
                                                    <FaEdit /> <span>Modifier</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Menu for Mobile */}
                <Menu
                    anchorEl={actionMenuAnchor}
                    open={Boolean(actionMenuAnchor)}
                    onClose={handleActionMenuClose}
                    className="action-context-menu"
                >
                    <MenuItem onClick={handleActionMenuClose}>
                        <FaEye /> Voir détails
                    </MenuItem>
                    {selectedActionItem?.statut === 'en_attente' && (
                        <>
                            <MenuItem onClick={handleActionMenuClose}>
                                <FaCheckCircle /> Approuver
                            </MenuItem>
                            <MenuItem onClick={handleActionMenuClose}>
                                <FaTimesCircle /> Rejeter
                            </MenuItem>
                        </>
                    )}
                </Menu>

                {/* Modal */}
                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                    <Box className="admin-modal">
                        <h5>Détails</h5>
                        {selectedItem && (
                            <div className="modal-content">
                                <p><strong>Titre:</strong> {selectedItem.titre || selectedItem.designation || selectedItem.action}</p>
                                <p><strong>Description:</strong> {selectedItem.description || selectedItem.justification || selectedItem.commentaire}</p>
                                <p><strong>Statut:</strong> {getStatusBadge(selectedItem.statut)}</p>
                            </div>
                        )}
                        <button className="btn-close-modal" onClick={() => setModalOpen(false)}>Fermer</button>
                    </Box>
                </Modal>

                <div><ScrollToTop /><Footer /></div>
            </div>
        </div>
    );
};

export default Administrations;