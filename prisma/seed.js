import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const videos = [
  {
    id: "3c051d40-4bb6-431b-b054-b197fb653533",
    title: "khalid",
    type: "youtube",
    youtubeUrl: "https://youtu.be/raX82EvBzsw?si=ZLVtQPZYSJmnRjfY",
    youtubeId: "raX82EvBzsw",
    thumbnail: "",
    active: true,
    order: 1,
    createdAt: "2026-07-02T00:00:00.000Z",
  },
  {
    id: "d827d44a-b3d5-49ce-9fff-12c4d47c10ff",
    title: "Good habits for kids",
    type: "youtube",
    youtubeUrl: "https://youtu.be/mR457XIRvy4?si=D8A-LXTN74k8KUnD",
    youtubeId: "mR457XIRvy4",
    thumbnail: "",
    active: true,
    order: 2,
    createdAt: "2026-07-02T15:41:18.000Z",
  },
  {
    id: "6b630cd0-9f44-45fd-a646-64f3b6716849",
    title: "Moments for Reminder",
    type: "youtube",
    youtubeUrl: "https://youtu.be/MMi3PXUVhG8?si=eILi8OXLCWKzCLzc",
    youtubeId: "MMi3PXUVhG8",
    thumbnail: "",
    active: true,
    order: 3,
    createdAt: "2026-07-02T15:41:42.000Z",
  },
  {
    id: "8aa48117-5123-465a-976f-55f36f5cd5e2",
    title: "who painted the sky blue",
    type: "youtube",
    youtubeUrl: "https://youtu.be/Wqd3kJqDHQ0?si=GqtrBlZEsao2glX5",
    youtubeId: "Wqd3kJqDHQ0",
    thumbnail: "",
    active: true,
    order: 4,
    createdAt: "2026-07-02T15:42:18.000Z",
  },
  {
    id: "4a86fa54-e812-4225-9196-e2c13656ea5c",
    title: "garvity",
    type: "youtube",
    youtubeUrl: "https://youtu.be/cD70FBN_WjM?si=_kknz99S0oRpVYeL",
    youtubeId: "cD70FBN_WjM",
    thumbnail: "",
    active: true,
    order: 5,
    createdAt: "2026-07-02T15:42:46.000Z",
  },
  {
    id: "95b816e5-a322-441e-93c8-1dfd5bfda79b",
    title: "FIre",
    type: "youtube",
    youtubeUrl: "https://youtu.be/U8WjfxIzuLk?si=uKy9lmWkRlji2oLK",
    youtubeId: "U8WjfxIzuLk",
    thumbnail: "",
    active: true,
    order: 6,
    createdAt: "2026-07-02T15:43:12.000Z",
  },
  {
    id: "cffa2ee9-73ae-4921-a81b-f944b17242e9",
    title: "heart",
    type: "youtube",
    youtubeUrl: "https://youtu.be/L5Jds5BxEv0?si=MRyyBCESnJeC5bpy",
    youtubeId: "L5Jds5BxEv0",
    thumbnail: "",
    active: true,
    order: 7,
    createdAt: "2026-07-02T15:44:45.000Z",
  },
  {
    id: "e25e260c-ca1a-41e8-bf1f-50e7b46efbef",
    title: "patience",
    type: "youtube",
    youtubeUrl: "https://youtu.be/5fNoBu2wm50?si=CjQ2oiEiewkGWjbC",
    youtubeId: "5fNoBu2wm50",
    thumbnail: "",
    active: true,
    order: 8,
    createdAt: "2026-07-02T15:45:18.000Z",
  },
  {
    id: "8248e946-9bbc-42ea-9131-ac1cb1ebbb3f",
    title: "bakra eid",
    type: "youtube",
    youtubeUrl: "https://youtu.be/A0OFtrab9Ec?si=RjajYq16FwZQLyj7",
    youtubeId: "A0OFtrab9Ec",
    thumbnail: "",
    active: true,
    order: 9,
    createdAt: "2026-07-02T15:46:06.000Z",
  },
];

const feedbackItems = [
  {
    id: "82b9e997-c670-4a63-904e-6095d873c5e8",
    text: "hellowqaerqw3r",
    author: "khaliddewqrwq3",
    childAge: "2-3 years",
    rating: 4,
    status: "rejected",
    createdAt: "2026-07-02T15:39:57.000Z",
  },
];

const popularVideos = [
  { id: "pv1", youtubeId: "U8WjfxIzuLk", title: "Aag Kese",            thumbnail: "" },
  { id: "pv2", youtubeId: "qACOENWwAgw", title: "Barish Ki",           thumbnail: "" },
  { id: "pv3", youtubeId: "cD70FBN_WjM", title: "Gravity",             thumbnail: "" },
  { id: "pv4", youtubeId: "A0OFtrab9Ec", title: "Zayn Ka Bakra HD Trailer", thumbnail: "" },
  { id: "pv5", youtubeId: "5E-rGkMRIqc", title: "Neela Aasman",        thumbnail: "" },
  { id: "pv6", youtubeId: "L5Jds5BxEv0", title: "Body",                thumbnail: "" },
];

async function seed() {
  let addedVideos = 0;
  for (const v of videos) {
    const existing = await prisma.video.findUnique({ where: { id: v.id } });
    if (existing) continue;
    await prisma.video.create({
      data: {
        id: v.id,
        title: v.title,
        type: v.type,
        youtubeUrl: v.youtubeUrl,
        youtubeId: v.youtubeId,
        thumbnail: v.thumbnail,
        media: null,
        active: v.active,
        order: v.order,
        createdAt: new Date(v.createdAt),
      },
    });
    addedVideos++;
  }

  let addedFeedback = 0;
  for (const f of feedbackItems) {
    const existing = await prisma.feedback.findUnique({ where: { id: f.id } });
    if (existing) continue;
    await prisma.feedback.create({
      data: {
        id: f.id,
        text: f.text,
        author: f.author,
        childAge: f.childAge,
        rating: f.rating,
        status: f.status,
        createdAt: new Date(f.createdAt),
      },
    });
    addedFeedback++;
  }

  let addedPopular = 0;
  for (const pv of popularVideos) {
    const existing = await prisma.popularVideo.findUnique({ where: { id: pv.id } });
    if (existing) continue;
    await prisma.popularVideo.create({
      data: {
        id: pv.id,
        title: pv.title,
        youtubeUrl: `https://youtu.be/${pv.youtubeId}`,
        youtubeId: pv.youtubeId,
        thumbnail: pv.thumbnail || "",
        active: true,
        order: popularVideos.indexOf(pv) + 1,
      },
    });
    addedPopular++;
  }

  console.log(`Seed complete: ${addedVideos} videos, ${addedFeedback} feedback, ${addedPopular} popular added`);
}

seed()
  .catch((e) => {
    console.error("Seed failed:", e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());