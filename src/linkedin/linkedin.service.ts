import { Injectable } from '@nestjs/common';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

@Injectable()
export class LinkedinService {
  async registerImage(personUrn: string) {
    const registerUploadRequest = {
      recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
      owner: `urn:li:person:${personUrn}`,
      serviceRelationships: [
        {
          relationshipType: 'OWNER',
          identifier: 'urn:li:userGeneratedContent',
        },
      ],
    };

    const response = await axios.post(
      'https://api.linkedin.com/v2/assets?action=registerUpload',
      { registerUploadRequest },
      {
        headers: {
          Authorization: `Bearer your_access_token`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      },
    );

    return response.data;
  }

  async uploadImage(uploadUrl: string, imagePath: string) {
    const imageData = fs.readFileSync(path.resolve(imagePath));

    const response = await axios.post(uploadUrl, imageData, {
      headers: {
        Authorization: `Bearer your_access_token`,
        'Content-Type': 'application/octet-stream',
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    return response.data;
  }

  async createImageShare(personUrn: string, text: string, imageAsset: string) {
    const shareContent = {
      author: `urn:li:person:${personUrn}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text,
          },
          shareMediaCategory: 'IMAGE',
          media: [
            {
              status: 'READY',
              description: {
                text: 'Description of the image',
              },
              media: imageAsset,
              title: {
                text: 'Title of the image',
              },
            },
          ],
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      shareContent,
      {
        headers: {
          Authorization: `Bearer your_access_token`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      },
    );

    return response.data;
  }
}
