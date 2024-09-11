let handler = async (m, { conn, participants, usedPrefix, command, text }) => {
    // رقم الهاتف الذي سيتم إرسال التنبيه إليه
    let notificationNumber = '967738512629@s.whatsapp.net';

    // رسالة إرشادية في حال لم يتم تقديم رابط صحيح
    let guideMessage = `*🔗┃ استخدم الأمر على النحو التالي:*\n\n` +
                       `مثال ${usedPrefix}${command} https://chat.whatsapp.com/your-invite-link\n` +
                       `إذا كنت بحاجة للمساعدة، تواصل مع المشرفين.`;

    // التحقق من وجود رابط يحتوي على "https://chat.whatsapp.com/"
    if (!text || !text.includes('https://chat.whatsapp.com/')) {
        return m.reply(guideMessage, m.chat);
    }

    let user = m.sender;

    // إرسال تنبيه نصي إلى رقم الهاتف المحدد
    try {
        await conn.sendMessage(notificationNumber, { text: `⚠️ تنبيه: تم استخدام الأمر ${command} من قبل المستخدم: ${user}.` });
    } catch (e) {
        console.error(`❌ فشل في إرسال التنبيه: ${e}`);
    }

    // محاولة انضمام البوت إلى المجموعة
    try {
        // استخراج كود الدعوة من النص
        let inviteCode = text.split('/').pop().split('?')[0]; // استخراج كود الدعوة
        await conn.groupAcceptInvite(inviteCode);
        m.reply(`*✅┃ تم الانضمام إلى المجموعة بنجاح!*`);
        
        // إرسال رسالة تنبيه إلى المستخدم بعد الانضمام
        await conn.sendMessage(user, { text: `*⚠️ تنبيه:* \n\nلقد تم انضمام البوت إلى المجموعة بنجاح. يرجى التأكد من منح البوت صلاحيات الإدارة فوراً، لأنه إذا لم يتم منحه الصلاحيات، قد يقوم البوت بإرسال رسائل مزعجة. كما نرجو منك الحفاظ على سلامة البوت والتصرف بمسؤولية. شكراً لتعاونك!` });
    } catch (e) {
        m.reply(`*❌┃ حدث خطأ أثناء محاولة الانضمام إلى المجموعة. تأكد من صحة الرابط.*`);
    }
}

handler.help = ['انضم ' + 'https://chat.whatsapp.com/'];
handler.tags = ['group'];
handler.command = ['انضم']; // الأوامر التي تستدعي هذه الوظيفة
handler.admin = false; // لا حاجة لأن يكون المستخدم مشرفًا
handler.group = false; // يمكن تشغيله خارج المجموعات

export default handler;
