import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Contact } from '../../model/contact.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactService } from '../../services/contact.service';

type ContactForm = Omit<Contact, 'id'>;

@Component({
    selector: 'app-contact-edit-page',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    templateUrl: './contact-edit.page.html',
    styleUrl: './contact-edit.page.css'
})
export class ContactEditPage {
    private readonly destroyRef = inject(DestroyRef);
    private readonly contactService = inject(ContactService);
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);

    contactId = this.route.snapshot.paramMap.get('id') ?? '';
    contact = signal<Contact | null>(null);
    form: ContactForm = this.emptyForm();

    constructor() {
        if (this.contactId) {
            this.contactService
                .getContact(this.contactId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((contact) => {
                    this.contact.set(contact);
                    this.form = {
                        name: contact.name,
                        phone: contact.phone,
                        email: contact.email,
                        address: contact.address,
                        avatar: contact.avatar
                    };
                });
        }
    }

    save(): void {
        if (!this.contactId) {
            return;
        }
        const data = this.cleanForm(this.form);
        this.contactService
            .updateContact(this.contactId, data)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate(['/home']));
    }

    remove(): void {
        if (!this.contactId) {
            return;
        }
        const confirmed = window.confirm('Delete this contact?');
        if (confirmed) {
            this.contactService
                .deleteContact(this.contactId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe(() => this.router.navigate(['/home']));
        }
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
