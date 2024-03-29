CREATE TABLE public.value_translations (
	e_id serial4 NOT NULL,
	universal varchar NOT NULL "The value in English",
	"local" varchar NOT NULL "The value in the language of this row",
	"language" varchar NOT NULL "ISO language code",
	CONSTRAINT value_translations_pkey PRIMARY KEY (e_id)
);

INSERT INTO value_translations
("universal", "local", "language")
VALUES
("Competition","Competition","en"),
("Cooperation","Cooperation","en"),
("Deceit","Deceit","en"),
("Defiance","Defiance","en"),
("Empathy","Empathy","en"),
("Help","Help","en"),
("Innocence","Innocence","en"),
("Kindness","Kindness","en"),
("Obedience","Obedience","en"),
("Prudence","Prudence","en"),
("Punishment","Punishment","en"),
("Reward","Reward","en"),
("Sincerity","Sincerity","en"),
("Trust","Trust","en"),
("Competition","Competizione","it"),
("Cooperation","Cooperazione","it"),
("Deceit","Inganno","it"),
("Defiance","Sfida","it"),
("Empathy","Empatia","it"),
("Help","Aiuto","it"),
("Innocence","Innocenza","it"),
("Kindness","Gentilezza","it"),
("Obedience","Obbedienza","it"),
("Prudence","Prudenza","it"),
("Punishment","Punizione","it"),
("Reward","Ricompensa","it"),
("Sincerity","Sincerità","it"),
("Trust","Fiducia","it"),
("Competition","Ανταγωνισμός","el"),
("Cooperation","Συνεργασία","el"),
("Deceit","Εξαπάτηση","el"),
("Defiance","Αψήφηση","el"),
("Empathy","Ενσυναίσθηση","el"),
("Help","Βοήθεια","el"),
("Innocence","Αθωότητα","el"),
("Kindness","Καλοσύνη","el"),
("Obedience","Υπακοή","el"),
("Prudence","Σύνεση","el"),
("Punishment","Τιμωρία","el"),
("Reward","Επιβράβευση","el"),
("Sincerity","Ειλικρίνεια","el"),
("Trust","Εμπιστοσύνη","el"),
("Competition","Състезание","bg"),
("Cooperation","Сътрудничество","bg"),
("Deceit","Измама","bg"),
("Defiance","Неподчинение","bg"),
("Empathy","Емпатия","bg"),
("Help","Помощ","bg"),
("Innocence","Невинност","bg"),
("Kindness","Доброта","bg"),
("Obedience","Послушание","bg"),
("Prudence","Благоразумие","bg"),
("Punishment","Наказание","bg"),
("Reward","Награда","bg"),
("Sincerity","Искреност","bg"),
("Trust","Доверие","bg");
