<div data-controller="switch feedback" 
    data-switch-delay-value="500" 
    data-action="switch:switched->feedback#focusIfVisible"
    data-feedback-endpoint-value="http://localhost:1234/feedback">
    <div data-switch-screen="controls">
        <p>Ces conseils vous ont été utiles ?</p>
        <div class="feedback-controls">
            <a class="button button-outline button-feedback button-feedback-positif" 
            data-feedback="positif" href="" role="button"
            data-action="switch#switch feedback#setPositiveFeedback"
            data-switch-source-param="controls" 
            data-switch-destination-param="feedback">Oui</a>
            <a class="button button-outline button-feedback button-feedback-negatif" 
            data-feedback="negatif" href="" role="button"
            data-action="switch#switch feedback#setNegativeFeedback"
            data-switch-source-param="controls" 
            data-switch-destination-param="feedback">Non</a>
            <a class="button button-outline button-partager button-feedback-partager" 
            href="" role="button"
            data-action="switch#switch"
            data-switch-source-param="controls" 
            data-switch-destination-param="partager">Partager</a>
            <a class="button button-outline button-imprimer button-feedback-imprimer js-impression" 
            href="" role="button">Imprimer</a>
        </div>
    </div>
    <div class="feedback-form" hidden data-switch-screen="feedback">
        <form data-action="feedback#send">
            <fieldset>
                <p role="status">Merci pour votre retour.</p>
                <label for="message_conseils">Pouvez-vous nous en dire plus, afin que nous puissions améliorer ces conseils ?</label>
                <textarea 
                id="message_conseils" name="message" rows="9" cols="20" required 
                data-feedback-target="textarea"
                ></textarea>
            </fieldset>
            <div class="form-controls">
                <input type="submit" class="button" value="Envoyer mes remarques"
                data-action="switch#switch"
                data-switch-source-param="feedback" 
                data-switch-destination-param="thankyou">
            </div>
        </form>
        <p class="feedback-email">ou écrivez-nous à : <a href="mailto:contact@mesconseilscovid.fr">contact@mesconseilscovid.fr</a></p>
    </div>
    <div class="feedback-thankyou" hidden data-switch-screen="thankyou">
        <p role="status">
            Merci beaucoup pour votre message qui nous aidera à améliorer les conseils.
        </p>
    </div>
    <div class="feedback-partager" hidden data-switch-screen="partager">
        <p role="status">
            Faites connaître Mes Conseils Covid en partageant ce lien (votre situation personnelle ne sera pas transmise) :
        </p>
        <ul>
            <li>
                <a href="https://www.facebook.com/sharer.php?u=https%3A%2F%2Fmesconseilscovid.sante.gouv.fr%2F&t=Mes%20Conseils%20Covid%20%3A%20Des%20conseils%20personnels%20pour%20agir%20contre%20le%20virus" class="button button-outline button-feedback-social-facebook" target="_blank" rel="noopener noreferrer" data-service="facebook">sur Facebook</a>
            </li>
            <li>
                <a href="fb-messenger://share/?link=https%3A%2F%2Fmesconseilscovid.sante.gouv.fr%2F&app_id=199122945319221" class="button button-outline button-feedback-social-messenger" target="_blank" rel="noopener noreferrer" data-service="messenger">sur Messenger</a>
            </li>
            <li>
                <a href="https://wa.me/?text=Mes%20Conseils%20Covid%20%3A%20Des%20conseils%20personnels%20pour%20agir%20contre%20le%20virus%20%E2%80%94%20https%3A%2F%2Fmesconseilscovid.sante.gouv.fr%2F" class="button button-outline button-feedback-social-whatsapp" target="_blank" rel="noopener noreferrer" data-service="whatsapp">sur WhatsApp</a>
            </li>
        </ul>
    </div>
</div>
