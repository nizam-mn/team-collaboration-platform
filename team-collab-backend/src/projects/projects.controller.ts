import {
  Body,
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Req,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './projects.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  create(@Body() body: CreateProjectDto, @Req() req) {
    return this.projectsService.createProject(body.name, req.user.sub);
  }

  @Get()
  getAll(@Req() req) {
    return this.projectsService.getUserProjects(req.user.sub);
  }

  @Get(':id')
getProject(
  @Param('id', ParseUUIDPipe) id: string,
  @Req() req,
) {
  return this.projectsService.getProjectById(id, req.user.sub);
}

  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) id: string, @Req() req) {
    return this.projectsService.deleteProject(id, req.user.sub);
  }
}
