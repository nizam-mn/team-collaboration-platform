import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, TaskStatus, UpdateTaskStatusDto } from './tasks.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post(':projectId')
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: CreateTaskDto,
    @Req() req,
  ) {
    return this.tasksService.createTask(body, projectId, req.user.sub);
  }

  @Get(':projectId')
  getTasks(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Req() req,
    @Query('status') status?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.tasksService.getTasks(
      projectId,
      req.user.sub,
      status as TaskStatus,
      limit ? Number(limit) : 10,
      offset ? Number(offset) : 0,
    );
  }

  @Patch(':taskId/status')
  updateStatus(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Body() body: UpdateTaskStatusDto,
    @Req() req,
  ) {
    return this.tasksService.updateStatus(taskId, body.status, req.user.sub);
  }

  @Delete(':taskId')
  delete(@Param('taskId', ParseIntPipe) taskId: number, @Req() req) {
    return this.tasksService.deleteTask(taskId, req.user.sub);
  }
}
