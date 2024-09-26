import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { InfoCircle, ExclamationTriangle } from 'react-bootstrap-icons';

const MentionsLegales = () => {
    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Mentions légales</h1>
            <Card className="p-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />Informations sur le site</h5>
                            <p>
                                Le site focaly.com est exploité par Focaly, société à responsabilité limitée au capital de 1000€,
                                immatriculée au Registre du Commerce et des Sociétés sous le numéro 985 090 398, dont le siège
                                social est situé 122 rue Amelot, 75011 à Paris.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />Contact</h5>
                            <p>
                                Pour toute question ou demande concernant le site ou les services proposés, vous pouvez nous
                                contacter :
                            </p>
                            <p>
                                Par e-mail à l'adresse : <a href="mailto:contact@focaly.com">contact@focaly.com</a>
                            </p>
                            <p>
                                Directeur de la publication : Malick N'diaye
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />Hébergement</h5>
                            <p>
                                Le site focaly.com est hébergé par Shopify, dont le siège social est situé à 126 York St. Ottawa,
                                ON K1N 5T5, au Canada.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />Propriété intellectuelle</h5>
                            <p>
                                <strong>Contenu généré par les utilisateurs :</strong> Les utilisateurs du site peuvent être
                                amenés à générer du contenu, tels que des avis ou des commentaires. En soumettant du contenu
                                sur le site, l'utilisateur accorde à Focaly une licence non exclusive, mondiale, perpétuelle,
                                irrévocable et transférable pour utiliser, modifier, reproduire, distribuer et afficher ce
                                contenu.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />Protection des données personnelles</h5>
                            <p>
                                <strong>Collecte de données :</strong> Focaly peut être amené à collecter certaines données
                                personnelles des utilisateurs du site. Les données collectées seront traitées conformément à
                                notre politique de confidentialité accessible à l'adresse suivante.
                            </p>
                            <p>
                                <strong>Cookies :</strong> Le site Focaly utilise des cookies pour améliorer l'expérience
                                utilisateur. Les utilisateurs peuvent gérer les paramètres relatifs aux cookies en consultant
                                notre politique de cookies accessible à l'adresse suivante.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />Responsabilité</h5>
                            <p>
                                <ExclamationTriangle className="me-2 text-warning" />
                                Focaly s'efforce de fournir des informations précises et à jour sur le site, mais ne saurait
                                garantir l'exactitude, l'exhaustivité ou la pertinence des informations fournies. En
                                conséquence, Focaly décline toute responsabilité en cas d'erreur, d'inexactitude ou
                                d'omission concernant les informations disponibles sur le site.
                            </p>
                            <p>
                                Focaly décline également toute responsabilité quant au contenu des sites internet vers
                                lesquels des liens hypertextes présents sur Focaly pourraient renvoyer. Ces liens sont
                                proposés aux utilisateurs à titre informatif.
                            </p>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <h5><InfoCircle className="me-2" />Droit applicable et litiges</h5>
                            <p>
                                Les présentes mentions légales sont soumises au droit français. En cas de litige, les
                                tribunaux compétents du lieu du siège social de Focaly seront seuls compétents.
                            </p>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default MentionsLegales;