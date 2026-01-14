# eksiCode Telegram Botu

## Nedir

Bu script, http://eksicode.org telegram grupları üzerindeki kayıtlı üye sayılarını ölçmek
ve chat geliştirmeleri için yazılmaktadır.

## Teknik Analiz

### **Mimari Yapı**
Bot **Telegraf** framework (v4.16.3) kullanılarak geliştirilmiş ve **Node.js 20** üzerinde çalışmaktadır. **PM2** ile çoklu süreç yönetimi ve **Docker** ile konteynerleştirme yapılmıştır.

### **Ana Bileşenler**

#### **1. Ana Bot Süreci (`telegram.js`)**
- **Kullanıcı etkileşim botu** komut işleme ile
- **Cron job zamanlayıcısı** günlük üye sayısı güncellemeleri için
- **Gerçek zamanlı mesaj işleme**

#### **2. Arka Plan Servisleri**
- **`telegram_func.js`**: Üye sayısı izleme servisi
- **`sourcess_controller.js`**: Kaynak bağlantı doğrulama servisi

### **Otomatik Özellikler**

**1. Üye Sayısı İzleme**
- **Günlük cron job** (01:00'da çalışır) üye sayılarını günceller
- Telegram API'den üye sayılarını çeker
- REST API ile veritabanını günceller
- 2 saniye gecikme ile hız sınırlaması yapar

**2. Kaynak Bağlantı Doğrulama**
- **Günlük cron job** kaynak bağlantı sağlığını kontrol eder
- HTTP durum kodlarını doğrular
- Bağlantı kullanılabilirliğine göre onay durumunu günceller
- Zaman aşımı ve hata yanıtlarını işler

**3. Kullanıcı Yönetimi**
- **Katılma/Ayrılma işleyicileri** yeni üyeler için
- **Easter egg yanıtları** tanınmayan komutlar için
- **Mesaj günlüğü** tüm etkileşimler için
- **Hata mesajı rastgeleleştirme** `hataMesaji.txt` dosyasından

### **Güvenlik ve İzinler**
- **Sadece admin komutları** izin kontrolleri ile
- **API kimlik doğrulama** JWT tokenları kullanarak
- **Grup istisna işleme** `.pinignore` dosyası ile
- **Hassas işlemler için mesaj silme**

### **Veri Entegrasyonu**
- **REST API entegrasyonu** EksiCode backend ile
- **Kaynak meta veri çıkarma** (başlıklar, başlıklar)
- **Grup yönetimi** veritabanı sorguları ile
- **Gerçek zamanlı durum güncellemeleri**

### **Teknik Stack**
- **Framework**: Telegraf v4.16.3
- **Runtime**: Node.js 20
- **Süreç Yöneticisi**: PM2
- **Konteynerleştirme**: Docker
- **HTTP İstemcisi**: Axios v1.12.2
- **Zamanlama**: node-cron v4.2.1
- **HTML Ayrıştırma**: node-html-parser v7.0.1

### **Ana Özellikler Özeti**
1. **Çoklu grup yönetimi** EksiCode toplulukları arasında
2. **Otomatik içerik moderasyonu** ban/unban yetenekleri ile
3. **Kaynak bağlantı doğrulama** ve onay iş akışı
4. **Üye sayısı takibi** analitik için
5. **Yayın mesajlaşma** pin işlevselliği ile
6. **Sosyal medya entegrasyonu** (Discord, YouTube, GitHub, Twitter)
7. **Kod paylaşımı** Hastebin entegrasyonu ile
8. **Yönetim kontrolleri** izin tabanlı erişim ile

### Nasıl Çalıştırılır

-   UYARI: Docker çalışırken git branch'ını değiştirmeyin. 

-   Paketleri yükleyin: `npm i`

-   sample.env dosyasındaki örnek ayarlara göre bir .env dosyası oluşturun.

-   Proje kök dizninde `.pinignore` adında dosya oluşturun.

-   Docker'ı çalıştırın: `docker-compose up --build`

## Bot Komutları

### Genel

-   `/help` - Komutları listeler.

-   `/yardim` - Komutları listeler.

-   `!kaynak <URL>`: Kaynak URL'sini Ekşicode veritabanına ekler.

-   `!kanal <Sorgu | tümü>` - kanalları listeler.

-   `!discord` -  Discord sunucumuz.

-   `!duyuru` -  Duyuru kanalımız.

-   `!hastebinize` - Kod içerikli / Uzun mesajları bu komut ile cevaplayarak hastebin'e yükleyebilirsiniz.


### Yönetim Komutları

#### `/ban <sebep>` / `/unban`
Bir kullanıcıyı banlamak için herhangi bir gruptayken kullanıcının mesajını `/ban` komutuyla cevaplamanız gerekmektedir. Ban komutuyla birlikte sebebini de yazabilirsiniz. Eğer bir kullanıcının banını kaldırmak istiyorsanız Admin kanalına gönderilen bildirim mesajını `/unban` komutu ile cevaplayın.

#### `/pin <mesaj>`
`mesaj` argümanını tüm Ekşicode gruplarına gönderir ve sabitler.


#### `/kontrol <kaynak-numaraları>`

Boş kullanıldığında onaylanmamış kaynakları listeler. Kaynakları onaylamak için komuta argüman olarak onaylamak istediğiniz kaynakların numaralarını boşlukla ayırarak yazınız. Onaylanmamış bir kaynağı silmek için silmek istediğiniz kaynağın numarasının başına `!` işareti koyun.

## Hata Mesajları

Siz de bu repoyu forklayıp `hataMesaji.txt` dosyası içerisine hata mesajı için ünlem ekleyebilirsiniz.

## .pinignore dosyası

`/pin` komutunun çalışmamasını istediğiniz kanalın ID'lerini .pinignore dosyasına ekleyerek istisnalar oluşturabilirsiniz.
