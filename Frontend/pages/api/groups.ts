import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  id: number,
  name: string,
  logo: string,
  icon: string | null,
  members: number,
  link: string,
  channelID: string,
  listOrder: number,
  created_at: string,
  updated_at: string,
  descriprion: string | null
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json<Data[]>(
    [
      { id: 40, name: "Duyuru", logo: "https://eksicode-images.s3.eu-central-1.amazonaws.com/duyuru.jpg", icon: null, members: 277, link: "https://t.me/+T21XXkOQtaChSIIu", channelID: "-1001332565854", listOrder: 0, created_at: "2020-01-16T14:41:12.000Z", updated_at: "2024-02-13T01:00:03.000Z", descriprion: null },
      { id: 1, name: "Genel Konular", logo: "https://eksicode-images.s3.eu-central-1.amazonaws.com/genel.jpg", icon: "", members: 1031, link: "https://t.me/+PaBUhA5nqiM5ODk0", channelID: "-1001364530781", listOrder: 1, created_at: "2019-10-01T19:53:24.000Z", updated_at: "2024-02-13T01:00:06.000Z", descriprion: "Yazılım hakkında genel konular." },
    ]
  );
}3