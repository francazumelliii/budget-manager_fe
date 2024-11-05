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
  open(component: any, inputs: any = {}, title: string = ''): Promise<ComponentRef<any>> {
    return new Promise((resolve, reject) => {
      if (this.modalComponentRef) {
        this.close(); // Close any open modals
      }

      // Create a reference to the modal component
      const componentRef = this.componentFactoryResolver
        .resolveComponentFactory(ModalComponent)
        .create(this.injector);

      // Attach the component to Angular's component tree
      this.appRef.attachView(componentRef.hostView);

      // Get the DOM element of the component
      const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;

      document.body.appendChild(domElem);

      // Set the type of the child component and its inputs
      const modalInstance = componentRef.instance as ModalComponent;
      modalInstance.childComponentType = component;
      modalInstance.childComponentInputs = inputs; // Pass inputs here
      modalInstance.title = title;

      this.modalComponentRef = componentRef;

      // Wait until the child component is created
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
