import { ApiProperty } from '@nestjs/swagger';

export class StatusOkDto {
  @ApiProperty({ example: 'ok', description: 'Successfully responded' })
  status: 'ok';
}
