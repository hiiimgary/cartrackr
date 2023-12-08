import { PartialType } from '@nestjs/mapped-types';
import { CreateCarTypeDto } from './create-type.dto';

export class UpdateCarTypeDto extends PartialType(CreateCarTypeDto) {}
