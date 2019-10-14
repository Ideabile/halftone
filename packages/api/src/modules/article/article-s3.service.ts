import { Injectable } from "@nestjs/common";
import { UploadService } from "../../services/s3.services";

@Injectable()
export class ArticleS3Service {

    constructor(
        private readonly uploadService: UploadService,
    ) { }

    public getAllArticles() {

        this.uploadService.s3.listObjects({
            Bucket: 'halftone-articles',
        })

    }

}
