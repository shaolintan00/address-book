import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Contact } from '../model/contact.model';

type ApiContact = Omit<Contact, 'id'> & { _id: string };

@Injectable({ providedIn: 'root' })
export class ContactService {
    private readonly baseUrl = '/api/contacts';

    constructor(private readonly http: HttpClient) { }

    getContacts(): Observable<Contact[]> {
        return this.http.get<ApiContact[]>(this.baseUrl).pipe(
            map((contacts) => contacts.map((contact) => this.mapContact(contact)))
        );
    }

    getContact(id: string): Observable<Contact> {
        return this.http.get<ApiContact>(`${this.baseUrl}/${id}`).pipe(
            map((contact) => this.mapContact(contact))
        );
    }

    createContact(payload: Omit<Contact, 'id'>): Observable<Contact> {
        return this.http.post<ApiContact>(this.baseUrl, payload).pipe(
            map((contact) => this.mapContact(contact))
        );
    }

    updateContact(id: string, payload: Omit<Contact, 'id'>): Observable<Contact> {
        return this.http.put<ApiContact>(`${this.baseUrl}/${id}`, payload).pipe(
            map((contact) => this.mapContact(contact))
        );
    }

    deleteContact(id: string): Observable<{ message: string }> {
        return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
    }

    private mapContact(contact: ApiContact): Contact {
        return {
            id: contact._id,
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            address: contact.address,
            avatar: contact.avatar
        };
    }
}
