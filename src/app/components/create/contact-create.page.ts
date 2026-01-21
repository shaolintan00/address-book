import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Contact } from '../../model/contact.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactService } from '../../services/contact.service';

type ContactForm = Omit<Contact, 'id'>;

@Component({
    selector: 'app-contact-create-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './contact-create.page.html',
    styleUrl: './contact-create.page.css'
})
export class ContactCreatePage {
    private readonly destroyRef = inject(DestroyRef);
    private readonly contactService = inject(ContactService);
    private readonly router = inject(Router);

    form: ContactForm = this.emptyForm();

    save(): void {
        const data = this.cleanForm(this.form);
        this.contactService
            .createContact(data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/home']));
    }

    private emptyForm(): ContactForm {
        return {
            name: '',
            phone: '',
            email: '',
            address: '',
            avatar: ''
        };
    }

    private cleanForm(form: ContactForm): ContactForm {
        return {
            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            address: form.address.trim(),
            avatar: form.avatar.trim()
        };
    }
}
