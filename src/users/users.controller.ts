import { UpdateUserDto } from './dto/users-update.dto';
import { UsersService } from './users.service';
import { Body, Controller, Logger, Param, Put } from '@nestjs/common';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<void> {
    try {
      await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      this.logger.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  }
}
