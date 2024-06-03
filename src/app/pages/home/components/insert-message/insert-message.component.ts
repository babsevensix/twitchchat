import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MessageService } from '../../../../services/messages.service';

@Component({
  selector: 'app-insert-message',
  standalone: true,
  imports: [ MatInputModule, ReactiveFormsModule, MatButtonModule ],
  templateUrl: './insert-message.component.html',
  styleUrl: './insert-message.component.scss'
})
export class InsertMessageComponent {

  messageService = inject(MessageService);

  formInputMessage = new FormControl<string>('', [Validators.required]);
  onSentMessage(): void {
    if (this.formInputMessage.value){
      this.messageService.sentNewMessage(this.formInputMessage.value);
    }
    this.formInputMessage.reset();
  }
}
