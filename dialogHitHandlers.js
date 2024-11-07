export class DialogHitHandlers {
    constructor() {
      this.numberDialog = document.getElementById("hitDialog");
      this.dialogTitle = document.getElementById("hitDialogTitle");
      this.dialogText = document.getElementById("hitDialogText");
      this.dialogOpen = false;
  
      this.initializeEventListeners();
    }
  
    initializeEventListeners() {
      this.numberDialog.addEventListener('close', () => {
        this.dialogOpen = false;
        document.dispatchEvent(new CustomEvent('dialogClosed'));
      });
  
      document.addEventListener('dialogOpened', () => {
        this.dialogOpen = true;
      });
    }
  
    showDialog(title, text) {
        this.dialogTitle.innerHTML = title;
        this.dialogText.innerHTML = text;
        this.numberDialog.showModal();
        document.dispatchEvent(new CustomEvent('dialogOpened'));
    }
  
    isDialogOpen() {
      return this.dialogOpen;
    }
  }