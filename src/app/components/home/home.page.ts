import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../model/contact.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ContactService } from '../../services/contact.service';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './home.page.html',
    styleUrl: './home.page.css'
})
export class HomePage {
    private readonly destroyRef = inject(DestroyRef);
    private readonly contactService = inject(ContactService);
    readonly contacts = signal<Contact[]>([]);

    constructor() {
        this.contactService
            .getContacts()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((contacts) => this.contacts.set(contacts));
    }

    getAvatar(contact: Contact): string {
        const avatar = contact.avatar.trim();
        if (avatar) {
            return avatar;
        }
        return `https://i.pravatar.cc/80?u=${encodeURIComponent(contact.email || contact.name)}`;
    }
}
