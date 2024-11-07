export class DialogHitHandlers {
    constructor() {
      this.numberDialog = document.getElementById("hitDialog");
      this.dialogText = document.getElementById("dialogText");
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
  
    showDialog(text) {
      this.dialogText.innerHTML = text;
      this.numberDialog.showModal();
      document.dispatchEvent(new CustomEvent('dialogOpened'));
    }
  
    isDialogOpen() {
      return this.dialogOpen;
    }
  }