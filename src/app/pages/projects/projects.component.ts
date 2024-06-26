import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '@app/services/projects/projects.service';
import { Project } from '@app/types/project.type';
import {
  ButtonComponent,
  InputComponent,
  SheetService,
  TableColumnConfig,
  TableComponent,
  TableDataFetcher,
  TableDefaultCellType,
} from '@ui/components';
import { take } from 'rxjs';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { Permissions } from '../../config/permission.config';
import { EnvironmentSelectorComponent } from '../../shared/components/environment-selector/environment-selector.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { ProjectConfigSheetComponent } from '../../shared/components/project-config-sheet/project-config-sheet.component';
import { PermissionAccessDirective } from '../../shared/directives/persmission-access.directive';

@Component({
  selector: 'app-projects',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header>
        <div class="flex gap-2 items-center">
          <ui-button
            *permissionAccess="this.projectsWriteScope"
            label="Create"
            trailingIcon="add-line"
            (click)="this.openProjectConfigSheet()"
          ></ui-button>
        </div>
      </app-page-header>
      <section class="page-content">
        <ui-table
          class="h-full min-h-0 block"
          [columns]="this.columns"
          [data]="this.dataFetcher"
          [pageable]="true"
        ></ui-table>
      </section>
    </div>
  `,
  standalone: true,
  imports: [
    ButtonComponent,
    PageHeaderComponent,
    FormsModule,
    RouterLink,
    InputComponent,
    AsyncPipe,
    EnvironmentSelectorComponent,
    TableComponent,
    PermissionAccessDirective,
  ],
})
export class ProjectsComponent {
  protected readonly columns: TableColumnConfig[] = [
    {
      id: 'name',
      label: 'Project',
      sortable: true,
      type: TableDefaultCellType.TextWithCopy,
    },
    {
      id: 'count.features',
      label: 'Features #',
      width: 15,
      minWidthInPx: 150,
      type: TableDefaultCellType.Text,
    },
    {
      id: 'count.environments',
      label: 'Environments #',
      width: 15,
      minWidthInPx: 150,
      type: TableDefaultCellType.Text,
    },
    {
      id: 'owner',
      label: 'User',
      width: 15,
      minWidthInPx: 150,
      type: TableDefaultCellType.User,
    },
    {
      id: 'createdAt',
      label: 'Date',
      width: '200px',
      sortable: true,
      sortDirection: 'desc',
      type: TableDefaultCellType.Date,
    },
  ];

  protected readonly projectsWriteScope: string[] = [Permissions.project.write];
  protected readonly dataFetcher: TableDataFetcher<Project>;

  readonly #sheetService = inject(SheetService);
  readonly #projectsService = inject(ProjectsService);

  public constructor() {
    this.dataFetcher = () =>
      this.#projectsService.getAllProjects().pipe(take(1));
  }

  protected openProjectConfigSheet(): void {
    this.#sheetService.open(ProjectConfigSheetComponent, {
      title: 'Create Project',
      size: SheetSize.Medium,
    });
  }
}
