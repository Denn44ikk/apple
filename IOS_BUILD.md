# «Мой план» — выпуск на iPhone

Проект iOS находится в `ios/App/App.xcodeproj`. В приложение встраивается локальная веб-сборка из `dist/client`: после установки оно не зависит от ссылки для тестирования.

## Что подготовить

- Mac с актуальным Xcode и доступом в интернет.
- Apple ID заказчика, включённый в Apple Developer Program и App Store Connect с ролью Account Holder, Admin или Developer.
- Уникальный идентификатор приложения. Сейчас задан `ru.moyplan.planner`. Перед первой подписью убедитесь, что он свободен в аккаунте; иначе замените его и в `capacitor.config.ts`, и в Xcode на, например, `ru.название-компании.moyplan`.
- Иконка приложения 1024×1024 PNG без прозрачности — её нужно добавить в `ios/App/App/Assets.xcassets/AppIcon.appiconset` до публикации в App Store.

## Рекомендуемый способ: TestFlight

Это нормальный способ, чтобы заказчица установила приложение сама: из App Store ставится TestFlight, затем приложение — по приглашению. Тестовая сборка действует 90 дней. Для постоянного использования после проверки отправьте эту же сборку на модерацию App Store.

1. На Mac откройте Terminal в папке проекта и выполните `npm ci`, затем `npm run ios:sync`.
2. Откройте `ios/App/App.xcodeproj` в Xcode.
3. Выберите проект `App` → target `App` → `Signing & Capabilities` → включите **Automatically manage signing** и выберите Team заказчика.
4. Проверьте Bundle Identifier: он должен совпадать с идентификатором приложения, созданным в Apple Developer и App Store Connect.
5. В Xcode выберите `Any iOS Device (arm64)` и выполните `Product` → `Archive`.
6. В окне Organizer выберите архив → `Distribute App` → `App Store Connect` → `Upload`.
7. В App Store Connect создайте карточку приложения «Мой план» (если её ещё нет), дождитесь обработки загруженной сборки и добавьте заказчицу в TestFlight как тестировщика. Ей придёт приглашение; она устанавливает TestFlight из App Store, открывает приглашение и нажимает **Install**.
8. Для постоянной установки заполните карточку: описание, категория, возрастной рейтинг, политика конфиденциальности, скриншоты и иконка; затем отправьте ту же сборку в App Review. После одобрения она устанавливается из App Store без срока действия.

## Если нужна именно `.ipa`

`.ipa` не устанавливается простым открытием файла на iPhone. В Xcode после `Archive` выберите `Distribute App` → `Custom` → `Ad Hoc` → `Export`. До экспорта зарегистрируйте iPhone заказчицы в Apple Developer и включите его в provisioning profile. Получившуюся `.ipa` устанавливают на этот зарегистрированный iPhone через Apple Configurator на Mac. Такая сборка ограничена профилем и сроком его действия, поэтому для постоянного использования предпочтителен App Store.

## Обновления

После изменений: `npm run ios:sync`, в Xcode увеличьте `Build` (CFBundleVersion), снова создайте Archive и загрузите новую сборку в TestFlight/App Store Connect.
