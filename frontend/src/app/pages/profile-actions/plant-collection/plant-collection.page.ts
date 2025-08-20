import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plant-collection',
  templateUrl: './plant-collection.page.html',
  styleUrls: ['./plant-collection.page.scss'],
})
export class PlantCollectionPage implements OnInit {
  plants: any[] = []; // Empty for now - you would populate this from a service

  constructor() { }

  ngOnInit() {
    // In a real app, you would load plants from a service
    // this.loadPlants();
  }

  loadPlants() {
    // Example data structure
    this.plants = [
      {
        id: 1,
        name: 'Rosemary',
        species: 'Salvia rosmarinus',
        image: 'assets/images/plants/rosemary.jpg',
        dateAdded: '2023-05-15',
        waterSchedule: 'Every 3 days'
      },
      {
        id: 2,
        name: 'Tomato Plant',
        species: 'Solanum lycopersicum',
        image: 'assets/images/plants/tomato.jpg',
        dateAdded: '2023-06-20',
        waterSchedule: 'Daily'
      }
    ];
  }
}