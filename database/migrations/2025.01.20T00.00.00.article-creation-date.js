// @ts-check

/**
 * @param {import("knex").Knex} knex
 */
// eslint-disable-next-line no-undef
module.exports.up = async (knex) => {
  await knex.raw(
    `
  Update cms."articles" set created_at = created_at - created_at::date + '2020-03-30'::date where slug = 'impact-mobilite';
  Update cms."articles" set created_at = created_at - created_at::date + '2020-05-16'::date where slug = 'budget';
  Update cms."articles" set created_at = created_at - created_at::date + '2020-07-29'::date where slug = 'affichage-ges-transport';
  Update cms."articles" set created_at = created_at - created_at::date + '2020-09-21'::date where slug = 'historique';
  Update cms."articles" set created_at = created_at - created_at::date + '2021-05-11'::date where slug = 'campus';
  Update cms."articles" set created_at = created_at - created_at::date + '2023-06-05'::date where slug = 'journee-mondial-environnement';
  Update cms."articles" set created_at = created_at - created_at::date + '2023-08-24'::date where slug = 'maladaptation';
  Update cms."articles" set created_at = created_at - created_at::date + '2023-10-12'::date where slug = 'effet-rebond';
  Update cms."articles" set created_at = created_at - created_at::date + '2023-11-01'::date where slug = 'definition-empreinte-carbone';
  Update cms."articles" set created_at = created_at - created_at::date + '2023-11-21'::date where slug = 'carbone-empreinte-parmi-autres';
  Update cms."articles" set created_at = created_at - created_at::date + '2023-11-21'::date where slug = 'neuf-limites-planetaires-empreintes';
  Update cms."articles" set created_at = created_at - created_at::date + '2023-12-21'::date where slug = 'challenge-tes-amis';
  Update cms."articles" set created_at = created_at - created_at::date + '2024-01-25'::date where slug = 'alternatives-voiture-individuelle';
  Update cms."articles" set created_at = created_at - created_at::date + '2024-03-18'::date where slug = 'nouveau-parcours-organisations';
  Update cms."articles" set created_at = created_at - created_at::date + '2024-04-09'::date where slug = 'demenagement-decarbonation';
  Update cms."articles" set created_at = created_at - created_at::date + '2024-04-23'::date where slug = 'transports-fuir-transports-cherir';
  Update cms."articles" set created_at = created_at - created_at::date + '2024-07-05'::date where slug = 'fonctionnalite-animateurs-ateliers-sensibilisation';
  Update cms."articles" set created_at = created_at - created_at::date + '2024-09-02'::date where slug = 'lexique-eau-tout-comprendre';
  Update cms."articles" set created_at = created_at - created_at::date + '2024-09-09'::date where slug = 'reflexes-textile-econome-empreinte-eau';
  Update cms."articles" set created_at = created_at - created_at::date + '2024-09-17'::date where slug = 'empreinte-eau-pourquoi-comment';
  Update cms."articles" set created_at = created_at - created_at::date + '2024-10-21'::date where slug = '8-facons-ameliorer-empreinte-de-mon-assiette';
`
  )
}
