import { UsersService } from './users.service';
import { Body, Controller, Logger, Param, Put } from '@nestjs/common';

@Controller('users')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly userService: UsersService) {}

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: any,
  ): Promise<void> {
    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  }
}
