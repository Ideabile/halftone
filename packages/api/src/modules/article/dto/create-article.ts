import { IsNotEmpty } from 'class-validator';

export class CreateArticleDto {

    @IsNotEmpty()
    readonly link: string;

    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly provider: string;

    @IsNotEmpty()
    readonly image: string;

}
