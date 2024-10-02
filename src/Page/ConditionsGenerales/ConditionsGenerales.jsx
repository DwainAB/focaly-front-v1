import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { InfoCircle, ExclamationTriangle } from 'react-bootstrap-icons';

const ConditionsGenerales = () => {
    return (
        <Container className="my-5">
            <h1 className="text-center mb-4 title-conditions">Conditions générales de location</h1>
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col>
                            <p>
                                En faisant appel aux services de location de produits audiovisuels de Focaly, le client
                                reconnaît et accepte sans réserve les présentes conditions de location. Ces conditions
                                gouvernent l'ensemble de la relation contractuelle entre le client et Focaly et prévalent
                                sur tout autre document. La location de nos produits audiovisuels implique donc
                                l'acceptation totale des termes et des conditions énoncés ici.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.1 : Objet</h5>
                            <p>
                                Les présentes conditions générales de location ont pour objet de définir les modalités
                                contractuelles et conditions auxquelles notre entreprise de location de produits audio-visuels
                                met à disposition ses équipements, tels que des appareils photo, des caméras embarquées,
                                des trépieds, et autres matériels audio-visuels.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.2 : Définitions</h5>
                            <ul>
                                <li><strong>Entreprise :</strong> fait référence à notre société de location de produits audio-visuels.</li>
                                <li><strong>Client :</strong> désigne toute personne physique ou morale qui effectue une réservation de location auprès de notre entreprise.</li>
                                <li><strong>Produits :</strong> englobe l'ensemble des équipements audio-visuels proposés à la location, tels que spécifiés sur notre site internet.</li>
                                <li><strong>Durée de la location :</strong> représente la période pendant laquelle le client a l'autorisation d'utiliser les produits loués.</li>
                                <li><strong>Contrat de Location :</strong> Les informations relatives au début et à la restitution du matériel.</li>
                            </ul>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.3 : Champ d'application</h5>
                            <p>
                                Les présentes conditions générales de vente s'appliquent à toutes les réservations et
                                locations effectuées auprès de notre entreprise, que ce soit par le biais de notre site
                                internet, par téléphone ou en personne.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.4 : Produits et services proposés</h5>
                            <p>
                                Notre entreprise propose à la location une large gamme de produits audio-visuels de haute
                                qualité, incluant, mais sans s'y limiter, des appareils photo numériques, des caméras
                                d'action GoPro, des caméras professionnelles, des trépieds, et d'autres accessoires
                                connexes. Nous offrons également des services complémentaires tels que des conseils
                                techniques et une assistance clientèle dédiée.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.5 : Tarifs et paiement</h5>
                            <p>
                                Les tarifs de location de nos produits sont clairement indiqués sur notre site internet et
                                sont exprimés en monnaie locale par journée de location. Le paiement s'effectue lors de la
                                réservation, et les modes de paiement acceptés seront précisés sur notre site. Tout retard
                                ou défaut de paiement pourra entraîner l'annulation de la réservation.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.6 : Durée de la location</h5>
                            <p>
                                La durée de location des produits est clairement spécifiée lors de la réservation. Le
                                client s'engage à respecter la période de location convenue et à restituer les produits à
                                la date et à l'heure prévues. Toute demande de prolongation de la location devra être faite
                                à l'avance et sera soumise à notre approbation.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.7 : Réservation et disponibilité</h5>
                            <p>
                                Pour effectuer une réservation, le client doit fournir des informations exactes et à jour.
                                La disponibilité des produits est sujette à confirmation et peut varier en fonction des
                                demandes. En cas d'indisponibilité d'un produit réservé, nous nous engageons à proposer
                                une solution de remplacement équivalente ou à rembourser intégralement le client.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.8 : Entrée en vigueur du contrat</h5>
                            <p>
                                Le Contrat entre en vigueur à compter de la remise du colis par Focaly au Transporteur. La
                                date de prise en charge mentionnée dans le suivi du colis envoyé à l'Utilisateur par le
                                Transporteur fait foi pour déterminer le début de la location. Dès réception du matériel,
                                la responsabilité des risques est transférée au Locataire, qui assume la garde matérielle et
                                juridique du matériel sous sa pleine responsabilité.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.9 : Caution et responsabilités</h5>
                            <p>
                                En louant nos produits, le client accepte la pleine responsabilité de leur utilisation, de
                                leur conservation et de leur retour en bon état. En cas de perte, de vol, de dommage ou de
                                casse des produits loués pendant la période de location, le client sera tenu responsable et
                                devra rembourser Focaly de la valeur totale du ou des produits concernés.
                            </p>
                            <p>
                                <strong>Caution :</strong> Nous ne demandons pas de caution préalable pour la location de nos produits.
                            </p>
                            <p>
                                <strong>Utilisation appropriée :</strong> Le client s'engage à utiliser nos produits conformément
                                aux instructions du fabricant et à ne pas les utiliser de manière abusive, illégale ou
                                dangereuse.
                            </p>
                            <p>
                                <strong>Notification des dommages :</strong> En cas de dommage ou de problème avec un produit
                                loué, le client doit immédiatement en informer Focaly pour que des mesures appropriées
                                puissent être prises.
                            </p>
                            <p>
                                <strong>Retard de retour :</strong> Le client doit retourner les produits sous un délai de 24h
                                après la date de fin de location. Tout retard de retour entraînera des frais supplémentaires
                                conformément à notre politique de tarification.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.10 : Responsabilité du Client lors de la Livraison</h5>
                            <p>
                                Le client est responsable de la réception du colis dès qu'il est déposé dans la boîte aux
                                lettres à l'adresse spécifiée lors de la commande. Il est impératif que le client surveille
                                régulièrement sa boîte aux lettres pour s'assurer de la réception du colis dès qu'il est
                                livré. Après la livraison réussie du colis à l'adresse spécifiée par le client, la
                                responsabilité de la sécurité du colis incombe entièrement au client.
                            </p>
                            <p>
                                Le client est tenu de prendre toutes les mesures nécessaires pour garantir la sécurité du
                                colis, y compris le stockage approprié dans un endroit sûr. Focaly ne peut pas être tenue
                                responsable de la sécurité du colis après la livraison réussie.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.11. Utilisation des produits</h5>
                            <p>
                                Le client s'engage à utiliser les produits loués de manière appropriée, conformément à
                                leur mode d'emploi, et à ne pas les utiliser à des fins illégales ou dommageables. Le client
                                est tenu responsable de toute infraction liée à l'utilisation des produits pendant la
                                période de location.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.12. Annulation et modification de réservation</h5>
                            <p>
                                Le locataire dispose d'un droit de rétractation de 14 jours à compter de la confirmation de
                                la réservation. Pour toute annulation de réservation, le client doit nous informer par écrit
                                au moins 24 heures avant la date de début de la location. Passé ce délai, des frais
                                d'annulation peuvent être appliqués.
                            </p>
                            <p>
                                Toute demande de modification de réservation devra être effectuée par écrit et sera
                                soumise à notre approbation.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.13 : Force majeure</h5>
                            <p>
                                Focaly ne pourra être tenue responsable de l'inexécution de ses obligations en cas de
                                force majeure, telle que définie par la loi. Les événements de force majeure incluent, sans
                                s'y limiter, les catastrophes naturelles, les guerres, les grèves, et autres événements
                                imprévus échappant à notre contrôle.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.14 : Propriété intellectuelle</h5>
                            <p>
                                Tous les éléments (textes, images, logos, etc.) présents sur notre site internet et nos
                                supports de communication sont protégés par les droits de propriété intellectuelle. Le
                                client s'engage à ne pas reproduire ou utiliser ces éléments sans notre autorisation
                                écrite préalable.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.15 : Droit applicable et litiges</h5>
                            <p>
                                Les présentes conditions générales de vente sont régies par la loi. En cas de litige
                                concernant l'interprétation ou l'exécution de ces conditions, les parties s'engagent à
                                tenter de résoudre le différend à l'amiable avant d'intenter toute action en justice.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.16 : Modifications des conditions générales</h5>
                            <p>
                                Focaly se réserve le droit de modifier les présentes conditions générales de vente à
                                tout moment. Les nouvelles conditions entreront en vigueur dès leur publication sur notre
                                site internet et seront applicables aux réservations effectuées après cette date.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.17 : Protection des données personnelles</h5>
                            <p>
                                Les informations collectées lors de la réservation sont nécessaires au traitement de la
                                commande. Focaly s'engage à respecter la confidentialité des données personnelles du
                                client et à les traiter conformément aux lois en vigueur sur la protection des données.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />ART.18 : Règlement des litiges</h5>
                            <p>
                                En cas de litige, le client peut soumettre sa réclamation à notre service client, qui
                                s'efforcera de trouver une solution amiable. Si aucune solution n'est trouvée, le client
                                pourra saisir les juridictions compétentes.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><ExclamationTriangle className="me-2" />ART.19 : Responsabilité de Focaly</h5>
                            <p>
                                Focaly décline toute responsabilité en cas de dommages indirects, immatériels ou
                                consécutifs résultant de l'utilisation de nos produits. Notre responsabilité est limitée
                                au montant total de la commande.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><ExclamationTriangle className="me-2" />ART.20 : Contact</h5>
                            <p>
                                Pour toute question, demande d'information ou réclamation concernant nos produits ou les
                                présentes conditions générales de vente, les clients peuvent nous contacter via notre
                                adresse mail : <a href="mailto:contact@focaly.com">contact@focaly.com</a>.
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default ConditionsGenerales;