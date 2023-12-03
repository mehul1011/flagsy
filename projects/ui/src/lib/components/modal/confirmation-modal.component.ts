import { A11yModule } from '@angular/cdk/a11y';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { Component, inject, TemplateRef } from '@angular/core';
import { ButtonComponent, ButtonVariant } from '../button/button.component';
import { ModalRef } from './modal.ref';
import { ConfirmationModalConfig } from './modal.type';

@Component({
  selector: 'ui-confirmation-modal',
  template: ` <div class="flex flex-col h-full gap-8">
    <section class="w-full flex-auto g min-h-0 overflow-y-auto h-full p-4">
      @if (this.message) {
        <div>{{ this.message }}</div>
      } @else if (this.template) {
        <ng-container
          *ngTemplateOutlet="this.template; context: this.templateContext"
        ></ng-container>
      }
    </section>
    <footer class="flex justify-end gap-4 border-t p-4">
      <ui-button
        cdkFocusinitial
        variant="neutral"
        [label]="this.cancelButtonText"
        (click)="this.onCancel()"
      ></ui-button>
      <ui-button
        [variant]="this.confirmButtonVariant"
        [label]="confirmButtonText"
        (click)="this.onConfirm()"
      ></ui-button>
    </footer>
  </div>`,
  standalone: true,
  imports: [ButtonComponent, NgComponentOutlet, A11yModule, NgTemplateOutlet],
})
export class ConfirmationModalComponent {
  readonly #modalData = inject<ConfirmationModalConfig>(DIALOG_DATA);
  readonly #modalRef = inject(ModalRef);

  get title(): string {
    return this.#modalData.title;
  }

  get message(): string | undefined {
    return typeof this.#modalData.content === 'string'
      ? this.#modalData.content
      : undefined;
  }

  get template(): TemplateRef<unknown> | undefined {
    return this.#modalData.content instanceof TemplateRef
      ? this.#modalData.content
      : undefined;
  }

  get templateContext(): unknown {
    return this.#modalData?.context;
  }

  get confirmButtonText(): string {
    return this.#modalData?.confirmButtonText ?? 'Confirm';
  }

  get confirmButtonVariant(): ButtonVariant {
    return this.#modalData?.confirmButtonVariant ?? 'primary';
  }

  get cancelButtonText(): string {
    return this.#modalData?.cancelButtonText ?? 'Cancel';
  }

  public onConfirm = (): void => {
    this.#modalRef.close(true);
  };

  public onCancel = (): void => {
    this.#modalRef.close(false);
  };
}
