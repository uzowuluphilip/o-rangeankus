import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: 'Dashboard',
      wireTransfer: 'Wire Transfer',
      internationalTransfer: 'International Transfer',
      directDeposit: 'Direct Deposit',
      transactions: 'Transactions',
      investments: 'Investments',
      settings: 'Settings',
      admin: 'Admin',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      home: 'Home',

      // Common
      welcome: 'Welcome',
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      loading: 'Loading',
      error: 'Error',
      success: 'Success',
      amount: 'Amount',
      balance: 'Balance',
      status: 'Status',
      date: 'Date',
      description: 'Description',

      // Dashboard
      accountBalance: 'Account Balance',
      recentTransactions: 'Recent Transactions',
      totalInvested: 'Total Invested',
      availableBalance: 'Available Balance',
      noTransactions: 'No transactions yet',

      // Wire Transfer
      recipientName: 'Recipient Name',
      bankName: 'Bank Name',
      accountNumber: 'Account Number',
      routingNumber: 'Routing Number',
      purpose: 'Purpose',
      sendTransfer: 'Send Transfer',
      transferCompleted: 'Wire transfer initiated successfully',
      transferFailed: 'Wire transfer failed. Please try again.',
      insufficientBalance: 'Insufficient balance',

      // Forms
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      required: 'This field is required',
      invalidEmail: 'Invalid email address',

      // Messages
      loginSuccess: 'Login successful',
      loginFailed: 'Login failed',
      registerSuccess: 'Registration successful',
      registerFailed: 'Registration failed',
      logoutSuccess: 'Logged out successfully'
    }
  },
  es: {
    translation: {
      // Navigation
      dashboard: 'Panel de Control',
      wireTransfer: 'Transferencia Bancaria',
      internationalTransfer: 'Transferencia Internacional',
      directDeposit: 'Depósito Directo',
      transactions: 'Transacciones',
      investments: 'Inversiones',
      settings: 'Configuración',
      admin: 'Administrador',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      home: 'Inicio',

      // Common
      welcome: 'Bienvenido',
      submit: 'Enviar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      loading: 'Cargando',
      error: 'Error',
      success: 'Éxito',
      amount: 'Cantidad',
      balance: 'Saldo',
      status: 'Estado',
      date: 'Fecha',
      description: 'Descripción',

      // Dashboard
      accountBalance: 'Saldo de Cuenta',
      recentTransactions: 'Transacciones Recientes',
      totalInvested: 'Total Invertido',
      availableBalance: 'Saldo Disponible',
      noTransactions: 'Sin transacciones aún',

      // Wire Transfer
      recipientName: 'Nombre del Destinatario',
      bankName: 'Nombre del Banco',
      accountNumber: 'Número de Cuenta',
      routingNumber: 'Número de Ruta',
      purpose: 'Propósito',
      sendTransfer: 'Enviar Transferencia',
      transferCompleted: 'Transferencia iniciada exitosamente',
      transferFailed: 'La transferencia falló. Inténtelo de nuevo.',
      insufficientBalance: 'Saldo insuficiente',

      // Forms
      firstName: 'Nombre',
      lastName: 'Apellido',
      email: 'Correo Electrónico',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      required: 'Este campo es requerido',
      invalidEmail: 'Dirección de correo inválida',

      // Messages
      loginSuccess: 'Inicio de sesión exitoso',
      loginFailed: 'Error en el inicio de sesión',
      registerSuccess: 'Registro exitoso',
      registerFailed: 'El registro falló',
      logoutSuccess: 'Sesión cerrada exitosamente'
    }
  },
  de: {
    translation: {
      // Navigation
      dashboard: 'Instrumententafel',
      wireTransfer: 'Banküberweisung',
      internationalTransfer: 'Internationale Überweisung',
      directDeposit: 'Direktüberweisung',
      transactions: 'Transaktionen',
      investments: 'Investitionen',
      settings: 'Einstellungen',
      admin: 'Administrator',
      logout: 'Abmelden',
      login: 'Anmelden',
      register: 'Registrieren',
      home: 'Startseite',

      // Common
      welcome: 'Willkommen',
      submit: 'Absenden',
      cancel: 'Abbrechen',
      save: 'Speichern',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
      loading: 'Wird geladen',
      error: 'Fehler',
      success: 'Erfolg',
      amount: 'Betrag',
      balance: 'Guthaben',
      status: 'Status',
      date: 'Datum',
      description: 'Beschreibung',

      // Dashboard
      accountBalance: 'Kontostand',
      recentTransactions: 'Letzte Transaktionen',
      totalInvested: 'Gesamtvermögen investiert',
      availableBalance: 'Verfügbarer Saldo',
      noTransactions: 'Noch keine Transaktionen',

      // Wire Transfer
      recipientName: 'Name des Empfängers',
      bankName: 'Bankname',
      accountNumber: 'Kontonummer',
      routingNumber: 'Bankleitzahl',
      purpose: 'Zweck',
      sendTransfer: 'Überweisung senden',
      transferCompleted: 'Banküberweisung erfolgreich eingeleitet',
      transferFailed: 'Überweisung fehlgeschlagen. Bitte versuchen Sie es erneut.',
      insufficientBalance: 'Unzureichendes Guthaben',

      // Forms
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      required: 'Dieses Feld ist erforderlich',
      invalidEmail: 'Ungültige E-Mail-Adresse',

      // Messages
      loginSuccess: 'Anmeldung erfolgreich',
      loginFailed: 'Anmeldung fehlgeschlagen',
      registerSuccess: 'Registrierung erfolgreich',
      registerFailed: 'Registrierung fehlgeschlagen',
      logoutSuccess: 'Erfolgreich abgemeldet'
    }
  },
  fr: {
    translation: {
      // Navigation
      dashboard: 'Tableau de Bord',
      wireTransfer: 'Virement Bancaire',
      internationalTransfer: 'Virement International',
      directDeposit: 'Dépôt Direct',
      transactions: 'Transactions',
      investments: 'Investissements',
      settings: 'Paramètres',
      admin: 'Administrateur',
      logout: 'Déconnexion',
      login: 'Connexion',
      register: 'S\'inscrire',
      home: 'Accueil',

      // Common
      welcome: 'Bienvenue',
      submit: 'Soumettre',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Éditer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      loading: 'Chargement',
      error: 'Erreur',
      success: 'Succès',
      amount: 'Montant',
      balance: 'Solde',
      status: 'Statut',
      date: 'Date',
      description: 'Description',

      // Dashboard
      accountBalance: 'Solde du Compte',
      recentTransactions: 'Transactions Récentes',
      totalInvested: 'Total Investi',
      availableBalance: 'Solde Disponible',
      noTransactions: 'Aucune transaction pour le moment',

      // Wire Transfer
      recipientName: 'Nom du Destinataire',
      bankName: 'Nom de la Banque',
      accountNumber: 'Numéro de Compte',
      routingNumber: 'Numéro de Routage',
      purpose: 'Objet',
      sendTransfer: 'Envoyer le Virement',
      transferCompleted: 'Virement initié avec succès',
      transferFailed: 'Le virement a échoué. Veuillez réessayer.',
      insufficientBalance: 'Solde insuffisant',

      // Forms
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Email',
      password: 'Mot de Passe',
      confirmPassword: 'Confirmer le Mot de Passe',
      required: 'Ce champ est requis',
      invalidEmail: 'Adresse email invalide',

      // Messages
      loginSuccess: 'Connexion réussie',
      loginFailed: 'Connexion échouée',
      registerSuccess: 'Inscription réussie',
      registerFailed: 'L\'inscription a échoué',
      logoutSuccess: 'Déconnecté avec succès'
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  })

export default i18n
