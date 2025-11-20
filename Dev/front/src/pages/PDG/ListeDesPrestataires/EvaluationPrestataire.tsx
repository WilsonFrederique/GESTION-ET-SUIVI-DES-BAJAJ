import React, { useState, useEffect } from 'react';
import './EvaluationPrestataire.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoBusinessOutline,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoDocumentTextOutline,
  IoStarOutline,
  IoStar,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoCalendarOutline,
  IoArrowBackOutline,
  IoPencilOutline,
  IoPrintOutline,
  IoShareOutline,
  IoDownloadOutline,
  IoStatsChartOutline,
  IoChatbubbleOutline,
  IoThumbsUpOutline,
  IoThumbsDownOutline
} from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

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

// Interface TypeScript
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

interface Evaluation {
  id_evaluation: number;
  id_prestataire: number;
  note: number;
  commentaire: string;
  date_evaluation: string;
  evaluateur: string;
  projet_associe: string;
  criteres: {
    qualite: number;
    delai: number;
    communication: number;
    prix: number;
    professionnalisme: number;
  };
}

const EvaluationPrestataire: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [prestataire, setPrestataire] = useState<Prestataire | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('historique');
  const [nouvelleEvaluation, setNouvelleEvaluation] = useState({
    note: 0,
    commentaire: '',
    evaluateur: '',
    projet_associe: '',
    criteres: {
      qualite: 0,
      delai: 0,
      communication: 0,
      prix: 0,
      professionnalisme: 0
    }
  });

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
      }
    ];

    const mockEvaluations: Evaluation[] = [
      {
        id_evaluation: 1,
        id_prestataire: 1,
        note: 4.5,
        commentaire: 'Prestataire très professionnel, respect des délais et excellente communication. Je recommande vivement.',
        date_evaluation: '2024-01-15',
        evaluateur: 'Jean Dupont',
        projet_associe: 'Développement App Mobile',
        criteres: {
          qualite: 5,
          delai: 4,
          communication: 5,
          prix: 4,
          professionnalisme: 5
        }
      },
      {
        id_evaluation: 2,
        id_prestataire: 1,
        note: 4.0,
        commentaire: 'Bon travail dans l\'ensemble, quelques retards mineurs mais qualité correcte.',
        date_evaluation: '2024-02-20',
        evaluateur: 'Marie Martin',
        projet_associe: 'Site E-commerce',
        criteres: {
          qualite: 4,
          delai: 3,
          communication: 4,
          prix: 5,
          professionnalisme: 4
        }
      },
      {
        id_evaluation: 3,
        id_prestataire: 1,
        note: 5.0,
        commentaire: 'Excellente collaboration, résultat au-delà de nos attentes. Très réactif et compétent.',
        date_evaluation: '2024-03-10',
        evaluateur: 'Pierre Durand',
        projet_associe: 'API Restful',
        criteres: {
          qualite: 5,
          delai: 5,
          communication: 5,
          prix: 5,
          professionnalisme: 5
        }
      }
    ];

    // Simuler le chargement des données
    setTimeout(() => {
      const foundPrestataire = mockPrestataires.find(p => p.id_prestataire === Number(id));
      setPrestataire(foundPrestataire || null);
      setEvaluations(mockEvaluations);
      setLoading(false);
    }, 1000);
  }, [id]);

  // Navigation
  const handleBack = (): void => {
    navigate('/listeDesPrestataires');
  };

  // Formatage de la date
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
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

  // Gestion de la nouvelle évaluation
  const handleNoteChange = (note: number): void => {
    setNouvelleEvaluation(prev => ({
      ...prev,
      note
    }));
  };

  const handleCritereChange = (critere: keyof typeof nouvelleEvaluation.criteres, valeur: number): void => {
    setNouvelleEvaluation(prev => ({
      ...prev,
      criteres: {
        ...prev.criteres,
        [critere]: valeur
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setNouvelleEvaluation(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const soumettreEvaluation = (): void => {
    // Simulation de soumission
    console.log('Nouvelle évaluation:', nouvelleEvaluation);
    alert('Évaluation soumise avec succès !');
    setNouvelleEvaluation({
      note: 0,
      commentaire: '',
      evaluateur: '',
      projet_associe: '',
      criteres: {
        qualite: 0,
        delai: 0,
        communication: 0,
        prix: 0,
        professionnalisme: 0
      }
    });
  };

  // Statistiques
  const statistiques = {
    nombreEvaluations: evaluations.length,
    noteMoyenne: evaluations.reduce((sum, eval_) => sum + eval_.note, 0) / evaluations.length,
    evaluationsPositives: evaluations.filter(e => e.note >= 4).length,
    evaluationsNegatives: evaluations.filter(e => e.note < 3).length
  };

  if (loading) {
    return (
      <div className="evaluation-prestataire-container">
        <div className="right-content w-100">
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Chargement des évaluations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prestataire) {
    return (
      <div className="evaluation-prestataire-container">
        <div className="right-content w-100">
          <div className="error-container">
            <div className="error-icon">❌</div>
            <h3>Prestataire non trouvé</h3>
            <p>Le prestataire que vous recherchez n'existe pas ou a été supprimé.</p>
            <button className="btn-primary" onClick={handleBack}>
              Retour à la liste
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="evaluation-prestataire-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <button 
              type="button"
              className="btn-back" 
              onClick={handleBack}
              aria-label="Retour à la liste des prestataires"
            >
              <IoArrowBackOutline />
            </button>
            <div>
              <h5 className="mb-0">Évaluations du Prestataire</h5>
              <p className="mb-0 subtitle">Gestion et consultation des évaluations</p>
            </div>
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
              <a href="/listeDesPrestataires">
                <StyledBreadcrumb
                  className="StyledBreadcrumb"
                  label="Liste des Prestataires"
                  icon={<ExpandMoreIcon fontSize="small" />}
                />
              </a>
              <StyledBreadcrumb
                className="StyledBreadcrumb"
                label="Évaluations"
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* En-tête du prestataire */}
        <div className="card shadow border-0 p-4 mt-4 prestataire-header">
          <div className="prestataire-main-info">
            <div className="prestataire-avatar">
              <IoBusinessOutline />
            </div>
            <div className="prestataire-title-section">
              <div className="title-row">
                <h1 className="prestataire-title">{prestataire.raison_sociale}</h1>
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

                <span className="rating">
                  <div className="stars">
                    {renderStars(prestataire.note_moyenne)}
                    <span className="rating-value">({prestataire.note_moyenne.toFixed(1)})</span>
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques des évaluations */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total">
              <IoStarOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.nombreEvaluations}</span>
              <span className="stat-label">Évaluations</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon certified">
              <IoThumbsUpOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.noteMoyenne.toFixed(1)}</span>
              <span className="stat-label">Note moyenne</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon active">
              <IoChatbubbleOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.evaluationsPositives}</span>
              <span className="stat-label">Évaluations positives</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon rating">
              <IoThumbsDownOutline />
            </div>
            <div className="stat-info">
              <span className="stat-number">{statistiques.evaluationsNegatives}</span>
              <span className="stat-label">Évaluations négatives</span>
            </div>
          </div>
        </div>

        {/* Navigation par onglets */}
        <div className="tabs-navigation">
          <button 
            className={`tab-button ${activeTab === 'historique' ? 'active' : ''}`}
            onClick={() => setActiveTab('historique')}
          >
            <IoDocumentTextOutline />
            Historique
          </button>
          <button 
            className={`tab-button ${activeTab === 'nouvelle' ? 'active' : ''}`}
            onClick={() => setActiveTab('nouvelle')}
          >
            <IoPencilOutline />
            Nouvelle Évaluation
          </button>
          <button 
            className={`tab-button ${activeTab === 'statistiques' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistiques')}
          >
            <IoStatsChartOutline />
            Statistiques
          </button>
        </div>

        {/* Contenu des onglets */}
        <div className="tab-content">
          {activeTab === 'historique' && (
            <div className="historique-tab">
              <div className="card shadow border-0 p-4">
                <div className="section-header">
                  <IoDocumentTextOutline className="section-icon" />
                  <h4>Historique des Évaluations</h4>
                </div>
                
                <div className="evaluations-list">
                  {evaluations.map(evaluation => (
                    <div key={evaluation.id_evaluation} className="evaluation-item">
                      <div className="evaluation-header">
                        <div className="evaluation-meta">
                          <div className="evaluateur">
                            <strong>{evaluation.evaluateur}</strong>
                            <span className="projet"> - {evaluation.projet_associe}</span>
                          </div>
                          <div className="evaluation-date">
                            {formatDate(evaluation.date_evaluation)}
                          </div>
                        </div>
                        <div className="evaluation-note">
                          <div className="stars">
                            {renderStars(evaluation.note)}
                          </div>
                          <span className="note-value">{evaluation.note.toFixed(1)}</span>
                        </div>
                      </div>
                      
                      <div className="evaluation-comment">
                        <p>{evaluation.commentaire}</p>
                      </div>
                      
                      <div className="evaluation-criteres">
                        <div className="critere">
                          <label>Qualité</label>
                          <div className="critere-stars">
                            {renderStars(evaluation.criteres.qualite)}
                          </div>
                        </div>
                        <div className="critere">
                          <label>Délai</label>
                          <div className="critere-stars">
                            {renderStars(evaluation.criteres.delai)}
                          </div>
                        </div>
                        <div className="critere">
                          <label>Communication</label>
                          <div className="critere-stars">
                            {renderStars(evaluation.criteres.communication)}
                          </div>
                        </div>
                        <div className="critere">
                          <label>Prix</label>
                          <div className="critere-stars">
                            {renderStars(evaluation.criteres.prix)}
                          </div>
                        </div>
                        <div className="critere">
                          <label>Professionnalisme</label>
                          <div className="critere-stars">
                            {renderStars(evaluation.criteres.professionnalisme)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nouvelle' && (
            <div className="nouvelle-tab">
              <div className="card shadow border-0 p-4">
                <div className="section-header">
                  <IoPencilOutline className="section-icon" />
                  <h4>Nouvelle Évaluation</h4>
                </div>
                
                <div className="evaluation-form">
                  <div className="form-group">
                    <label>Note globale</label>
                    <div className="note-selector">
                      {[1, 2, 3, 4, 5].map(note => (
                        <button
                          key={note}
                          type="button"
                          className={`note-btn ${nouvelleEvaluation.note >= note ? 'selected' : ''}`}
                          onClick={() => handleNoteChange(note)}
                        >
                          <IoStar className="star" />
                          <span>{note}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Évaluateur</label>
                    <input
                      type="text"
                      name="evaluateur"
                      value={nouvelleEvaluation.evaluateur}
                      onChange={handleInputChange}
                      placeholder="Nom de l'évaluateur"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Projet associé</label>
                    <input
                      type="text"
                      name="projet_associe"
                      value={nouvelleEvaluation.projet_associe}
                      onChange={handleInputChange}
                      placeholder="Nom du projet"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Critères d'évaluation</label>
                    <div className="criteres-grid">
                      <div className="critere-form">
                        <label>Qualité du travail</label>
                        <div className="critere-stars">
                          {[1, 2, 3, 4, 5].map(note => (
                            <button
                              key={note}
                              type="button"
                              className={`critere-star ${nouvelleEvaluation.criteres.qualite >= note ? 'selected' : ''}`}
                              onClick={() => handleCritereChange('qualite', note)}
                            >
                              <IoStar />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="critere-form">
                        <label>Respect des délais</label>
                        <div className="critere-stars">
                          {[1, 2, 3, 4, 5].map(note => (
                            <button
                              key={note}
                              type="button"
                              className={`critere-star ${nouvelleEvaluation.criteres.delai >= note ? 'selected' : ''}`}
                              onClick={() => handleCritereChange('delai', note)}
                            >
                              <IoStar />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="critere-form">
                        <label>Communication</label>
                        <div className="critere-stars">
                          {[1, 2, 3, 4, 5].map(note => (
                            <button
                              key={note}
                              type="button"
                              className={`critere-star ${nouvelleEvaluation.criteres.communication >= note ? 'selected' : ''}`}
                              onClick={() => handleCritereChange('communication', note)}
                            >
                              <IoStar />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="critere-form">
                        <label>Rapport qualité/prix</label>
                        <div className="critere-stars">
                          {[1, 2, 3, 4, 5].map(note => (
                            <button
                              key={note}
                              type="button"
                              className={`critere-star ${nouvelleEvaluation.criteres.prix >= note ? 'selected' : ''}`}
                              onClick={() => handleCritereChange('prix', note)}
                            >
                              <IoStar />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="critere-form">
                        <label>Professionnalisme</label>
                        <div className="critere-stars">
                          {[1, 2, 3, 4, 5].map(note => (
                            <button
                              key={note}
                              type="button"
                              className={`critere-star ${nouvelleEvaluation.criteres.professionnalisme >= note ? 'selected' : ''}`}
                              onClick={() => handleCritereChange('professionnalisme', note)}
                            >
                              <IoStar />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Commentaire</label>
                    <textarea
                      name="commentaire"
                      value={nouvelleEvaluation.commentaire}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre expérience avec ce prestataire..."
                      className="form-textarea"
                      rows={4}
                    />
                  </div>

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="btn-secondary"
                      onClick={() => setNouvelleEvaluation({
                        note: 0,
                        commentaire: '',
                        evaluateur: '',
                        projet_associe: '',
                        criteres: {
                          qualite: 0,
                          delai: 0,
                          communication: 0,
                          prix: 0,
                          professionnalisme: 0
                        }
                      })}
                    >
                      Annuler
                    </button>
                    <button 
                      type="button" 
                      className="btn-primary"
                      onClick={soumettreEvaluation}
                      disabled={!nouvelleEvaluation.note || !nouvelleEvaluation.evaluateur}
                    >
                      <IoCheckmarkCircleOutline />
                      Soumettre l'évaluation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'statistiques' && (
            <div className="statistiques-tab">
              <div className="card shadow border-0 p-4">
                <div className="section-header">
                  <IoStatsChartOutline className="section-icon" />
                  <h4>Statistiques Détaillées</h4>
                </div>
                
                <div className="stats-details">
                  <div className="stats-row">
                    <div className="stat-item">
                      <h5>Répartition des notes</h5>
                      <div className="distribution-bars">
                        {[5, 4, 3, 2, 1].map(note => {
                          const count = evaluations.filter(e => Math.floor(e.note) === note).length;
                          const percentage = evaluations.length > 0 ? (count / evaluations.length) * 100 : 0;
                          return (
                            <div key={note} className="distribution-bar">
                              <span className="note-label">{note} étoiles</span>
                              <div className="bar-container">
                                <div 
                                  className="bar-fill" 
                                  style={{width: `${percentage}%`}}
                                ></div>
                              </div>
                              <span className="percentage">{percentage.toFixed(1)}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="stats-row">
                    <div className="stat-item">
                      <h5>Moyenne par critère</h5>
                      <div className="criteres-moyennes">
                        {Object.entries({
                          qualite: 'Qualité',
                          delai: 'Délai',
                          communication: 'Communication',
                          prix: 'Prix',
                          professionnalisme: 'Professionnalisme'
                        }).map(([key, label]) => {
                          const moyenne = evaluations.length > 0 
                            ? evaluations.reduce((sum, e) => sum + e.criteres[key as keyof typeof evaluations[0]['criteres']], 0) / evaluations.length
                            : 0;
                          return (
                            <div key={key} className="critere-moyenne">
                              <span className="critere-label">{label}</span>
                              <div className="critere-stars">
                                {renderStars(moyenne)}
                              </div>
                              <span className="moyenne-value">{moyenne.toFixed(1)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default EvaluationPrestataire;