export interface Salle {
  id?: number;
  nom: string;
  description: string;
  adresse: string;
  capacite: number;
  prixHeure: number;
  images: string[];
  equipements: string[];
  createdAt?: Date;
}
