import { MaxFileSizeValidator, FileTypeValidator, ParseFilePipe } from '@nestjs/common';

export const imageValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
    new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
  ],
  fileIsRequired: true,
});
