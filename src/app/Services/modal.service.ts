import { Injectable, ComponentFactoryResolver, ApplicationRef, Injector, EmbeddedViewRef, ComponentRef, ChangeDetectorRef } from '@angular/core';
import { ModalComponent } from '../Components/modal/modal.component';


@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalComponentRef: ComponentRef<ModalComponent> | null = null;
  private childComponentRef: ComponentRef<any> | null = null;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
  ) {}
  open(component: any, inputs: any = {}, title: string = '', height: string = 'auto'): Promise<ComponentRef<any>> {
    return new Promise((resolve, reject) => {
      if (this.modalComponentRef) {
        this.close(); 
      }
  
      const componentRef = this.componentFactoryResolver
        .resolveComponentFactory(ModalComponent)
        .create(this.injector);
  
      this.appRef.attachView(componentRef.hostView);
  
      const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
  
      document.body.appendChild(domElem);
  
      const modalInstance = componentRef.instance as ModalComponent;
      modalInstance.childComponentType = component;
      modalInstance.childComponentInputs = inputs; 
      modalInstance.title = title;
      modalInstance.height = height;  
  
      this.modalComponentRef = componentRef;
  
      setTimeout(() => {
        this.childComponentRef = modalInstance.childComponentRef;
        if (this.childComponentRef) {
          resolve(this.childComponentRef);
        } else {
          reject('Failed to create child component');
        }
      });
    });
  }
  


  close(): void {
    if (this.modalComponentRef) {
      this.appRef.detachView(this.modalComponentRef.hostView);
      this.modalComponentRef.destroy();
      this.modalComponentRef = null;
      this.childComponentRef = null;
    }
  }
  updateChildInputs(inputs: { [key: string]: any }): void {
    if (this.childComponentRef && this.childComponentRef.instance) {
      Object.keys(inputs).forEach((key) => {
        if (key in this.childComponentRef!.instance) {
          this.childComponentRef!.instance[key] = inputs[key];
        }
      });
  
      // Rileva modifiche nel componente figlio per assicurare l'aggiornamento del template
      const changeDetector = this.childComponentRef.injector.get(ChangeDetectorRef);
      changeDetector.detectChanges();
    } else {
      console.error("Child component not initialized or doesn't have inputs.");
    }
  }
}
