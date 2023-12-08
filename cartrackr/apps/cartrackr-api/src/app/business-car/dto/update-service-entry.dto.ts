import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceEntryDto } from './create-service-entry.dto';

export class UpdateServiceEntryDto extends PartialType(CreateServiceEntryDto) {}
