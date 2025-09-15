import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

import { TagsService } from '../../../services/label';
import { LabelsI } from '../../../models/labels';

@Component({
  selector: 'app-show-tags',
  standalone: true,
  imports: [CommonModule, RouterModule, TableModule, ButtonModule, TagModule],
  templateUrl: './showlabels.html'
})
export class Showlabels {
  tags: LabelsI[] = [];

  constructor(private tagsService: TagsService) {
    this.tagsService.tags$.subscribe(list => this.tags = list);
  }

  eliminar(id: number) {
    this.tagsService.deleteTag(id);
  }
}
