import React, { useState, useEffect } from 'react';
import './FrmUtilisateurs.css';
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { 
  IoArrowBackOutline,
  IoSaveOutline,
  IoCloseOutline,
  IoCloudUploadOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoLocationOutline,
  IoLockClosedOutline,
  IoBusinessOutline
} from "react-icons/io5";
import ScrollToTop from '../../../components/Helper/ScrollToTop';
import Footer from '../../../components/Footer/Footer';
import { Chip, emphasize, styled } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

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

// Interface Utilisateur basée sur votre structure
interface Utilisateur {
  id_utilisateur?: number;
  nom: string;
  prenom: string;
  image?: string;
  email: string;
  mot_de_passe: string;
  confirmer_mot_de_passe: string;
  role: 'admin' | 'agent' | 'responsable' | 'decideur';
  telephone: string;
  region: string;
  est_actif: boolean;
  id_superieur?: number;
}

const FrmUtilisateurs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // États du formulaire
  const [formData, setFormData] = useState<Utilisateur>({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    confirmer_mot_de_passe: '',
    role: 'agent',
    telephone: '',
    region: '',
    est_actif: true,
    id_superieur: undefined
  });

  // Données mock pour les supérieurs
  const [superieurs, setSuperieurs] = useState<Array<{id_utilisateur: number, nom_complet: string}>>([
    { id_utilisateur: 1, nom_complet: 'Amadou Diallo' },
    { id_utilisateur: 2, nom_complet: 'Fatou Ndiaye' },
    { id_utilisateur: 7, nom_complet: 'Oumar Ba' }
  ]);

  // Options pour les régions
  const regions = [
    'Dakar', 'Thiès', 'Saint-Louis', 'Kaolack', 'Ziguinchor', 
    'Tambacounda', 'Kolda', 'Fatick', 'Kédougou', 'Matam', 'Louga'
  ];

  // Vérifier si on est en mode édition
  useEffect(() => {
    if (location.state?.utilisateur) {
      const utilisateur = location.state.utilisateur;
      setIsEditing(true);
      setFormData({
        ...utilisateur,
        mot_de_passe: '', // Ne pas afficher le mot de passe hashé
        confirmer_mot_de_passe: ''
      });
      if (utilisateur.image) {
        setImagePreview(utilisateur.image);
      }
    }
  }, [location.state]);

  // Gestion des changements de champs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Gestion de l'upload d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner une image valide');
        return;
      }

      // Vérifier la taille du fichier (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('L\'image ne doit pas dépasser 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Supprimer l'image
  const handleRemoveImage = () => {
    setImagePreview(null);
  };

  // Valider le formulaire
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.nom.trim()) errors.push('Le nom est requis');
    if (!formData.prenom.trim()) errors.push('Le prénom est requis');
    if (!formData.email.trim()) errors.push('L\'email est requis');
    
    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) errors.push('L\'email n\'est pas valide');

    if (!formData.telephone.trim()) errors.push('Le téléphone est requis');
    if (!formData.region) errors.push('La région est requise');

    // Validation mot de passe seulement pour la création
    if (!isEditing) {
      if (!formData.mot_de_passe) errors.push('Le mot de passe est requis');
      if (formData.mot_de_passe.length < 6) errors.push('Le mot de passe doit contenir au moins 6 caractères');
      if (formData.mot_de_passe !== formData.confirmer_mot_de_passe) errors.push('Les mots de passe ne correspondent pas');
    }

    if (errors.length > 0) {
      alert('Veuillez corriger les erreurs suivantes:\n' + errors.join('\n'));
      return false;
    }

    return true;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici, vous enverriez les données à votre API
      console.log('Données à envoyer:', {
        ...formData,
        image: imagePreview
      });

      // Message de succès
      alert(isEditing ? 'Utilisateur modifié avec succès!' : 'Utilisateur créé avec succès!');
      
      // Redirection vers la liste des utilisateurs
      navigate('/utilisateurs');
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Annuler et retourner
  const handleCancel = () => {
    if (window.confirm('Voulez-vous vraiment annuler? Les modifications non enregistrées seront perdues.')) {
      navigate('/utilisateurs');
    }
  };

  return (
    <div className="frm-utilisateurs-container">
      <div className="right-content w-100">
        {/* Header */}
        <div className="card shadow border-0 w-100 flex-row p-4 header-card">
          <div className="header-title">
            <button 
              className="btn-back"
              onClick={handleCancel}
              title="Retour à la liste"
            >
              <IoArrowBackOutline />
            </button>
            <div>
              <h5 className="mb-0">
                {isEditing ? 'Modifier l\'Utilisateur' : 'Nouvel Utilisateur'}
              </h5>
              <p className="mb-0 subtitle">
                {isEditing ? 'Modifier les informations de l\'utilisateur' : 'Créer un nouvel utilisateur dans le système'}
              </p>
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
              <a href="/utilisateurs">
                <StyledBreadcrumb
                  className="StyledBreadcrumb"
                  component="a"
                  label="Utilisateurs"
                />
              </a>
              <StyledBreadcrumb
                className="StyledBreadcrumb"
                label={isEditing ? 'Modifier' : 'Nouveau'}
                icon={<ExpandMoreIcon fontSize="small" />}
              />
            </Breadcrumbs>
          </div>
        </div>

        {/* Formulaire */}
        <div className="form-container">
          <form onSubmit={handleSubmit} className="bgColor user-form">
            <div className="form-sections">
              {/* Section Informations Personnelles */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <IoPersonOutline />
                  </div>
                  <h6>Informations Personnelles</h6>
                </div>
                
                <div className="section-content">
                  {/* Upload Photo */}
                  <div className="form-group photo-upload">
                    <label className="form-label">Photo de profil</label>
                    <div className="upload-container">
                      <div className="avatar-preview">
                        {imagePreview ? (
                          <div className="avatar-with-actions">
                            <img src={imagePreview} alt="Preview" className="avatar-image" />
                            <button 
                              type="button" 
                              className="remove-image"
                              onClick={handleRemoveImage}
                            >
                              <IoCloseOutline />
                            </button>
                          </div>
                        ) : (
                          <div className="avatar-placeholder">
                            <IoPersonOutline />
                          </div>
                        )}
                      </div>
                      <div className="upload-controls">
                        <input
                          type="file"
                          id="image-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="file-input"
                        />
                        <label htmlFor="image-upload" className="upload-btn">
                          <IoCloudUploadOutline />
                          {imagePreview ? 'Changer la photo' : 'Télécharger une photo'}
                        </label>
                        <p className="upload-hint">PNG, JPG max 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="prenom" className="form-label">
                        Prénom <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="prenom"
                        name="prenom"
                        className="form-input"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        placeholder="Entrez le prénom"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="nom" className="form-label">
                        Nom <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        id="nom"
                        name="nom"
                        className="form-input"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="Entrez le nom"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="email" className="form-label">
                        Email <span className="required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <IoMailOutline className="input-icon" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-input"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="exemple@fid.sn"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="telephone" className="form-label">
                        Téléphone <span className="required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <IoCallOutline className="input-icon" />
                        <input
                          type="tel"
                          id="telephone"
                          name="telephone"
                          className="form-input"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          placeholder="+261 XX XXX XX XX"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section Rôle et Accès */}
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon">
                    <IoBusinessOutline />
                  </div>
                  <h6>Rôle et Accès</h6>
                </div>
                
                <div className="section-content">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="role" className="form-label">
                        Rôle <span className="required">*</span>
                      </label>
                      <select
                        id="role"
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="agent">Agent</option>
                        <option value="responsable">Responsable</option>
                        <option value="admin">Administrateur</option>
                        <option value="decideur">Décideur</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="region" className="form-label">
                        Région <span className="required">*</span>
                      </label>
                      <div className="input-with-icon">
                        <IoLocationOutline className="input-icon" />
                        <select
                          id="region"
                          name="region"
                          className="form-select"
                          value={formData.region}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Sélectionnez une région</option>
                          {regions.map(region => (
                            <option key={region} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="id_superieur" className="form-label">
                      Supérieur hiérarchique
                    </label>
                    <select
                      id="id_superieur"
                      name="id_superieur"
                      className="form-select"
                      value={formData.id_superieur || ''}
                      onChange={handleInputChange}
                    >
                      <option value="">Aucun supérieur</option>
                      {superieurs.map(sup => (
                        <option key={sup.id_utilisateur} value={sup.id_utilisateur}>
                          {sup.nom_complet}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="est_actif"
                        checked={formData.est_actif}
                        onChange={handleInputChange}
                        className="checkbox-input"
                      />
                      <span className="checkmark"></span>
                      Utilisateur actif
                    </label>
                    <p className="checkbox-help">
                      Si désactivé, l'utilisateur ne pourra pas se connecter au système
                    </p>
                  </div>
                </div>
              </div>

              {/* Section Sécurité - seulement pour la création */}
              {!isEditing && (
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <IoLockClosedOutline />
                    </div>
                    <h6>Sécurité</h6>
                  </div>
                  
                  <div className="section-content">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="mot_de_passe" className="form-label">
                          Mot de passe <span className="required">*</span>
                        </label>
                        <div className="input-with-icon password-input">
                          <IoLockClosedOutline className="input-icon" />
                          <input
                            type={showPassword ? "text" : "password"}
                            id="mot_de_passe"
                            name="mot_de_passe"
                            className="form-input"
                            value={formData.mot_de_passe}
                            onChange={handleInputChange}
                            placeholder="Entrez le mot de passe"
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                          </button>
                        </div>
                        <p className="input-help">Minimum 6 caractères</p>
                      </div>

                      <div className="form-group">
                        <label htmlFor="confirmer_mot_de_passe" className="form-label">
                          Confirmer le mot de passe <span className="required">*</span>
                        </label>
                        <div className="input-with-icon password-input">
                          <IoLockClosedOutline className="input-icon" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmer_mot_de_passe"
                            name="confirmer_mot_de_passe"
                            className="form-input"
                            value={formData.confirmer_mot_de_passe}
                            onChange={handleInputChange}
                            placeholder="Confirmez le mot de passe"
                            required
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions du formulaire */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={handleCancel}
                disabled={loading}
              >
                <IoCloseOutline />
                Annuler
              </button>
              
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    {isEditing ? 'Modification...' : 'Création...'}
                  </>
                ) : (
                  <>
                    <IoSaveOutline />
                    {isEditing ? 'Modifier l\'utilisateur' : 'Créer l\'utilisateur'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div>
          <ScrollToTop />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default FrmUtilisateurs;