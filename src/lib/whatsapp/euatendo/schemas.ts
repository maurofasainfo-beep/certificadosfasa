import { z } from "zod";

const looseRecord = z.record(z.string(), z.unknown());

export const euAtendoInstanceSchema = looseRecord.transform((value) => ({
  id: String(value.id ?? value.uuid ?? value.instanceId ?? ""),
  name: typeof value.name === "string" ? value.name : null,
  phoneNumber: typeof value.phoneNumber === "string" ? value.phoneNumber : null,
  profileName: typeof value.profileName === "string" ? value.profileName : null,
  status: typeof value.status === "string" ? value.status : null,
  serverType: typeof value.serverType === "string" ? value.serverType : null,
  createdAt: typeof value.createdAt === "string" ? value.createdAt : null,
}));

export const listInstancesResponseSchema = looseRecord.transform((value) => ({
  success: value.success === true,
  instances: z.array(euAtendoInstanceSchema).catch([]).parse(value.instances),
  count: typeof value.count === "number" ? value.count : null,
}));

export const instanceStatusResponseSchema = looseRecord.transform((value) => ({
  success: value.success === true,
  connected: value.connected === true || value.status === "connected",
  status: typeof value.status === "string" ? value.status : null,
  profileName: typeof value.profileName === "string" ? value.profileName : null,
  phoneNumber: typeof value.phoneNumber === "string" ? value.phoneNumber : null,
  serverType: typeof value.serverType === "string" ? value.serverType : null,
  cached: typeof value.cached === "boolean" ? value.cached : null,
}));

export const checkNumberResponseSchema = looseRecord.transform((value) => {
  const results = Array.isArray(value.results) ? value.results : [];

  return results.map((item) => {
    const row = looseRecord.catch({}).parse(item);
    return {
      number: String(row.number ?? ""),
      exists: typeof row.exists === "boolean" ? row.exists : null,
      jid: typeof row.jid === "string" ? row.jid : null,
    };
  });
});

export const sendTextResponseSchema = looseRecord.transform((value) => ({
  success: value.success === true,
  message: typeof value.message === "string" ? value.message : null,
  messageId: typeof value.messageId === "string" ? value.messageId : typeof value.id === "string" ? value.id : null,
  status: typeof value.status === "string" ? value.status : null,
  chatId: typeof value.chatId === "string" ? value.chatId : typeof value.chatid === "string" ? value.chatid : null,
  raw: value,
}));

export const euAtendoCheckNumberSchema = z.object({
  number: z.string().trim().min(8).max(30),
});

export const euAtendoTestMessageSchema = z.object({
  number: z.string().trim().min(8).max(30),
  message: z.string().trim().min(3).max(1200),
  check_number: z.boolean().optional().default(true),
  confirm_send: z.literal(true, {
    error: "Confirme explicitamente o envio da mensagem de teste.",
  }),
});
