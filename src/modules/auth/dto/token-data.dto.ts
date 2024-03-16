import { ApiProperty } from '@nestjs/swagger';

export class TokenDataDto {
  @ApiProperty()
  access: string;

  @ApiProperty()
  refresh: string;
}
